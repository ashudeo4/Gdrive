import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
} from "@/components/ui/card"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FileItem {
  id: string;
  fileName: string;
  [key: string]: any;
}

export function SectionCards() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [file, setFile] = useState<FileItem[]>([])
  const [renamingFile, setRenamingFile] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchData = async () => {
    const response = await fetch(`${baseUrl}/api/file`, {
      headers:
        { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem("token")}` }
    })
    const data = await response.json()
    setFile(data.data)
  }

  const handleRename = (fileId: string, currentName: string) => {
    setRenamingFile(fileId)
    setNewFileName(currentName)
  }

  const handleRenameSubmit = async (fileId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/file/${fileId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ fileName: newFileName })
      })

      if (response.ok) {
        setFile(file.map(item =>
          item.id === fileId ? { ...item, fileName: newFileName } : item
        ))
        setRenamingFile(null)
      }
    } catch (error) {
      console.error("Error renaming file:", error)
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/file/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem("token")}`
        }
      })

      if (response.ok) {
        setFile(file.filter(item => item.id !== fileId))
      }
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }
  const handleDownload = async (val:any) => {
    try {
      let filename = val.fileName;
      const response = await fetch(`${baseUrl}/api/file/download/${filename}`, {
        headers:
          { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem("token")}` }
      });

      if (!response.ok) {
        throw new Error('File not found');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Set the suggested file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
      
    } catch(error) {
      console.error("Error downlaoding file:", error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [handleDelete, handleRenameSubmit])

  const filteredFiles = file && file.length > 0 && file.filter(item => 
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  let components: React.ReactElement[] = [<h1>No file uploaded</h1>]
  if (filteredFiles && filteredFiles.length > 0) {
    components = filteredFiles.map((val) => {
      return (
        <Card key={val._id} className="@container/card">
          <CardHeader>
            {renamingFile === val._id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="h-8"
                />
                <Button
                  size="sm"
                  onClick={() => handleRenameSubmit(val._id)}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRenamingFile(null)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <ContextMenu>
                <ContextMenuTrigger>{val.fileName}</ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleRename(val._id, val.fileName)}>Rename</ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(val._id)}>Delete</ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDownload(val)}>Download</ContextMenuItem>

                </ContextMenuContent>
              </ContextMenu>
            )}
          </CardHeader>
        </Card>
      )
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 lg:px-6">
        <Input 
          type="text" 
          placeholder="Search files..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {components}
      </div>
    </div>
  )
}
