import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RunwareService } from "@/services/runware";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ImageEditorProps {
  originalImageUrl: string;
  onImageEdited: (newImageUrl: string) => void;
}

export const ImageEditor = ({ originalImageUrl, onImageEdited }: ImageEditorProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEditImage = async () => {
    if (!apiKey.trim()) {
      toast.error("Por favor ingresa tu API key de Runware");
      return;
    }

    setIsProcessing(true);
    
    try {
      const runware = new RunwareService(apiKey);
      
      const result = await runware.editImage({
        inputImage: originalImageUrl,
        positivePrompt: "Remove the two smaller objects, keep only the main largest audio interface device, clean professional product photo",
        strength: 0.7,
        CFGScale: 7,
      });

      onImageEdited(result.imageURL);
      toast.success("Imagen editada exitosamente");
      
    } catch (error) {
      console.error("Error editing image:", error);
      toast.error("Error al editar la imagen. Verifica tu API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key de Runware</Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="Ingresa tu API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Obtén tu API key en <a href="https://runware.ai/" target="_blank" rel="noopener noreferrer" className="text-primary underline">runware.ai</a>
        </p>
      </div>
      
      <Button 
        onClick={handleEditImage} 
        disabled={isProcessing || !apiKey.trim()}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Editando imagen...
          </>
        ) : (
          "Eliminar objetos pequeños"
        )}
      </Button>
    </div>
  );
};