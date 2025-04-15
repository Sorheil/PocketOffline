"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Code2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import AddCodeForm from "@/components/add-code-form"
import CodeSnippet from "@/components/ code-snippet"
import EmptyState from "@/components/empty-state"
import { toast } from "sonner"
import { CodeSnippetType } from "@/types/type"


export default function Home() {
  const [snippets, setSnippets] = useState<CodeSnippetType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippetType | null>(null)

  // Load snippets from localStorage on component mount
  useEffect(() => {
    const savedSnippets = localStorage.getItem("codeSnippets")
    if (savedSnippets) {
      setSnippets(JSON.parse(savedSnippets))
    }
  }, [])

  // Save snippets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("codeSnippets", JSON.stringify(snippets))
  }, [snippets])

  const addSnippet = (snippet: Omit<CodeSnippetType, "id" | "createdAt">) => {
    //create a new snipet
    const newSnippet: CodeSnippetType = {
      ...snippet,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }

    //set a new snipet to the beginning of the array
    setSnippets((prev) => [newSnippet, ...prev])

    //close the form
    setIsFormOpen(false)

    //inform the user that the snippet has been added
    toast.message('Snippet added', {
      description: "Your code snippet has been saved successfully.",
    })
  }

  const deleteSnippet = (id: string) => {

    setSnippets((prev) => prev.filter((snippet) => snippet.id !== id))
    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null)
    }
    toast.message("Snippet deleted", {
      description: "Your code snippet has been removed.",
    })
  }

  const filteredSnippets = snippets.filter(
      (snippet) =>
          snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet.language.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
      <div className="container mx-auto p-4 max-w-6xl">
        {/*fade in to show the content*/}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
        >
          {/*header*/}
          <header className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Code2 className="h-8 w-8" />
                PocketOffline
              </h1>
              <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Add Code
              </Button>
            </div>
            <p className="text-muted-foreground">Store and organize your code snippets with syntax highlighting</p>
          </header>

          {/*search bar*/}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search snippets by title, description or language..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/*snippets*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <h2 className="font-medium">Your Snippets ({filteredSnippets.length})</h2>
              {filteredSnippets.length === 0 ? (
                  <EmptyState searchQuery={searchQuery} />
              ) : (
                  <AnimatePresence>
                    {filteredSnippets.map((snippet) => (
                        <motion.div
                            key={snippet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                          <Card
                              className={`cursor-pointer hover:shadow-md transition-all ${
                                  selectedSnippet?.id === snippet.id ? "border-primary" : ""
                              }`}
                              onClick={() => setSelectedSnippet(snippet)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium truncate">{snippet.title}</h3>
                                  <p className="text-sm text-muted-foreground truncate">{snippet.description}</p>
                                  <div className="flex items-center mt-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {snippet.language}
                              </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                {new Date(snippet.createdAt).toLocaleDateString()}
                              </span>
                                  </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteSnippet(snippet.id)
                                    }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                    ))}
                  </AnimatePresence>
              )}
            </div>

            <div className="md:col-span-2">
              <AnimatePresence mode="wait">
                {selectedSnippet ? (
                    <motion.div
                        key="snippet-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                      <CodeSnippet snippet={selectedSnippet} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex items-center justify-center p-12 border rounded-lg bg-muted/30"
                    >
                      <div className="text-center">
                        <Code2 className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">Select a snippet</h3>
                        <p className="text-muted-foreground mt-2">Choose a code snippet from the list to view it here</p>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </motion.div>

        <AnimatePresence>
          {isFormOpen && <AddCodeForm onSubmit={addSnippet} onCancel={() => setIsFormOpen(false)} />}
        </AnimatePresence>
      </div>
  )
}

