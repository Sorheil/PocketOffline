import { FileQuestion, Search } from "lucide-react"



export default function EmptyState({ searchQuery}: Readonly<{ searchQuery: string}>) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/30">
            {searchQuery ? (
                <>
                    <Search className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No results found</h3>
                    <p className="text-muted-foreground mt-2">No snippets match your search &quot;{searchQuery}&quot;</p>
                </>
            ) : (
                <>
                    <FileQuestion className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No snippets yet</h3>
                    <p className="text-muted-foreground mt-2">
                        Add your first code snippet by clicking the &quot;Add Code&quot; button
                    </p>
                </>
            )}
        </div>
    )
}

