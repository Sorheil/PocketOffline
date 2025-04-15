"use client"

import {useState} from "react"
import {motion} from "framer-motion"
import {Copy, Check, Download} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {toast} from "sonner"
import {CodeSnippetType} from "@/types/type"
import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs"


export default function CodeSnippet({snippet}: { snippet: CodeSnippetType }) {
    const [copied, setCopied] = useState(false)
    const [theme, setTheme] = useState<"light" | "dark">("dark")

    const copyToClipboard = () => {
        navigator.clipboard.writeText(snippet.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.message('Copied to clipboard', {
            description: 'The code has been copied to your clipboard.',
        })
    }

    const downloadSnippet = () => {
        const element = document.createElement("a")
        const file = new Blob([snippet.code], {type: "text/plain"})
        element.href = URL.createObjectURL(file)
        element.download = `${snippet.title.replace(/\s+/g, "-").toLowerCase()}.${getFileExtension(snippet.language)}`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
        toast.message("Downloaded", {
            description: 'Your code snippet has been downloaded.',
        })
    }

    const getFileExtension = (language: string) => {
        const extensions: Record<string, string> = {
            javascript: "js",
            typescript: "ts",
            python: "py",
            java: "java",
            c: "c",
            cpp: "cpp",
            csharp: "cs",
            go: "go",
            ruby: "rb",
            rust: "rs",
            php: "php",
            swift: "swift",
            kotlin: "kt",
            html: "html",
            css: "css",
            sql: "sql",
            bash: "sh",
            json: "json",
            yaml: "yml",
            markdown: "md",
        }
        return extensions[language] || "txt"
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{snippet.title}</CardTitle>
                        {snippet.description && <CardDescription>{snippet.description}</CardDescription>}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={copyToClipboard}
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={downloadSnippet}
                            title="Download snippet"
                        >
                            <Download className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{snippet.language}</span>
                    <Tabs value={theme} onValueChange={(value) => setTheme(value as "light" | "dark")}
                          className="w-auto">
                        <TabsList className="h-8">
                            <TabsTrigger value="light" className="text-xs px-2">
                                Light
                            </TabsTrigger>
                            <TabsTrigger value="dark" className="text-xs px-2">
                                Dark
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <motion.div
                    key={theme}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.2}}
                    className="rounded-md overflow-hidden"
                >
                    <SyntaxHighlighter
                        language={snippet.language}
                        style={theme === "dark" ? atomOneDark : atomOneLight}
                        customStyle={{
                            margin: 0,
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                        }}
                        showLineNumbers
                        wrapLines
                        wrapLongLines
                    >
                        {snippet.code}
                    </SyntaxHighlighter>
                </motion.div>
            </CardContent>
        </Card>
    )
}

