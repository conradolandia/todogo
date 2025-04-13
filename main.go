package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Todo struct
type Todo struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Completed bool               `json:"completed"`
	Body      string             `json:"body"`
}

// Todo list
var todos []Todo = []Todo{}

// MongoDB collection
var collection *mongo.Collection

// Load environment variables
func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}
}

// Main function
func main() {
	// Start server
	fmt.Println("Starting server...")

	loadEnv()

	// Connect to MongoDB
	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)

	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal("❌ Error connecting to MongoDB:", err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatal("❌ Error pinging MongoDB:", err)
	}

	fmt.Println("🍃 Connected to MongoDB Atlas")

	collection = client.Database("todogo_db").Collection("todos")

	// Create Fiber app
	app := fiber.New()

	// Routes
	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodo)
	app.Patch("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	// Start server
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "4000"
	}
	log.Fatal(app.Listen(":" + PORT))
}

// Get all todos
func getTodos(c *fiber.Ctx) error {
	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	for cursor.Next(context.Background()) {
		var todo Todo
		if err := cursor.Decode(&todo); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		todos = append(todos, todo)
	}

	defer cursor.Close(context.Background())

	return c.JSON(todos)
}

// Create a todo
func createTodo(c *fiber.Ctx) error {
	todo := new(Todo)

	if err := c.BodyParser(todo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"❌ Error": err.Error()})
	}

	if todo.Body == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"❌ Error": "Body is required"})
	}

	insertResult, err := collection.InsertOne(context.Background(), todo)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"❌ Error": err.Error()})
	}

	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"created": todo})
}

// Update a todo
func updateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"❌ Error": "Invalid ID"})
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": bson.M{"completed": true}}

	todo, err := collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"❌ Error": err.Error()})
	}

	if todo.ModifiedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"❌ Error": "Todo not found"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"updated": todo})
}

// Delete a todo
func deleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"❌ Error": "Invalid ID"})
	}

	filter := bson.M{"_id": objectID}

	todo, err := collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"❌ Error": err.Error()})
	}

	if todo.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"❌ Error": "Todo not found"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"deleted": todo})
}
