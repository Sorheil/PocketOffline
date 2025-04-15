
//CodeSnippet type
export type CodeSnippetType = {
    id: string
    title: string
    description: string
    language: string
    code: string
    createdAt: number
}

export type EmptyStateProps = {
    searchQuery: string
    snippetsExist: boolean
}
