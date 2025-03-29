import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useAuthStore } from "../store/auth";

interface Question {
  id?: string;
  question: string;
  options: string[];
  correct_answer: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const QuestionManagement = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
    category_id: "",
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is admin
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (data && !error) {
        setIsAdmin(true);
      }
    };

    checkIfAdmin();
  }, [user]);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch questions for selected category
  const { data: questions, isLoading } = useQuery({
    queryKey: ["admin-questions", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("category_id", selectedCategory);

      if (error) throw error;
      return data as Question[];
    },
    enabled: !!selectedCategory,
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setNewQuestion({
      ...newQuestion,
      category_id: e.target.value,
    });
  };

  const handleAddQuestion = async () => {
    // Validate the question
    if (!newQuestion.question.trim()) {
      setError("Question text is required");
      return;
    }

    // Ensure all options have text
    if (newQuestion.options.some((opt) => !opt.trim())) {
      setError("All options must have text");
      return;
    }

    // Ensure correct answer is one of the options
    if (!newQuestion.options.includes(newQuestion.correct_answer)) {
      setError("Correct answer must be one of the options");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("questions")
        .insert(newQuestion)
        .select();

      if (error) throw error;

      // Reset form and refresh questions
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
        category_id: selectedCategory,
      });
      setIsAddingQuestion(false);
      setSuccess("Question added successfully!");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["admin-questions", selectedCategory],
      });
      queryClient.invalidateQueries({
        queryKey: ["questions", selectedCategory],
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add question");
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    // Validate the question
    if (!editingQuestion.question.trim()) {
      setError("Question text is required");
      return;
    }

    // Ensure all options have text
    if (editingQuestion.options.some((opt) => !opt.trim())) {
      setError("All options must have text");
      return;
    }

    // Ensure correct answer is one of the options
    if (!editingQuestion.options.includes(editingQuestion.correct_answer)) {
      setError("Correct answer must be one of the options");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("questions")
        .update({
          question: editingQuestion.question,
          options: editingQuestion.options,
          correct_answer: editingQuestion.correct_answer,
        })
        .eq("id", editingQuestion.id)
        .select();

      if (error) throw error;

      // Reset editing state and refresh questions
      setEditingQuestion(null);
      setSuccess("Question updated successfully!");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["admin-questions", selectedCategory],
      });
      queryClient.invalidateQueries({
        queryKey: ["questions", selectedCategory],
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update question");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const { error } = await supabase.from("questions").delete().eq("id", id);

      if (error) throw error;

      setSuccess("Question deleted successfully!");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["admin-questions", selectedCategory],
      });
      queryClient.invalidateQueries({
        queryKey: ["questions", selectedCategory],
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete question");
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-xl">Please sign in to access this page.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center p-8">
        <p className="text-xl">
          You need administrator privileges to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Question Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button className="float-right" onClick={() => setError("")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            {!isAddingQuestion && (
              <button
                onClick={() => setIsAddingQuestion(true)}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Question
              </button>
            )}
          </div>

          {isAddingQuestion && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Question</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter question text"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      className="w-full p-2 border rounded-md"
                      placeholder={`Option ${index + 1}`}
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correct_answer === option}
                      onChange={() =>
                        setNewQuestion({
                          ...newQuestion,
                          correct_answer: option,
                        })
                      }
                      className="ml-2"
                    />
                    <span className="ml-1 text-sm">Correct</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddingQuestion(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestion}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Question
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center p-4">Loading questions...</div>
          ) : questions && questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  {editingQuestion && editingQuestion.id === question.id ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Text
                        </label>
                        <input
                          type="text"
                          value={editingQuestion.question}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              question: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Options
                        </label>
                        {editingQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...editingQuestion.options];
                                newOptions[index] = e.target.value;
                                setEditingQuestion({
                                  ...editingQuestion,
                                  options: newOptions,
                                });
                              }}
                              className="w-full p-2 border rounded-md"
                            />
                            <input
                              type="radio"
                              name={`correctAnswer_${question.id}`}
                              checked={
                                editingQuestion.correct_answer === option
                              }
                              onChange={() =>
                                setEditingQuestion({
                                  ...editingQuestion,
                                  correct_answer: option,
                                })
                              }
                              className="ml-2"
                            />
                            <span className="ml-1 text-sm">Correct</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingQuestion(null)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateQuestion}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" /> Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold mb-2">
                          {question.question}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingQuestion(question)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Edit Question"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id!)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-md ${
                              option === question.correct_answer
                                ? "bg-green-100 border border-green-300"
                                : "bg-gray-50"
                            }`}
                          >
                            {option}
                            {option === question.correct_answer && (
                              <span className="ml-2 text-xs text-green-800 font-medium">
                                (Correct Answer)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p>
                No questions found for this category. Add some questions to get
                started.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
