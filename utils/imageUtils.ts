
export const fileToGenerativePart = (file: File): Promise<{ mimeType: string, data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type || 'application/octet-stream';
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};
