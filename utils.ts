
import saveAs from 'file-saver';
import html2canvas from 'html2canvas';

/**
 * Helper function to clean markdown for a standard text look.
 * This function removes common markdown syntax to produce plain text.
 * @param text The input string which may contain markdown.
 * @returns A cleaned string without markdown formatting.
 */
export const cleanupMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    // Remove bold/italic markers (e.g., **text**, __text__, *text*, _text_)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove heading markers (e.g., # Title, ## Title)
    .replace(/^#{1,6}\s*(.*)/gm, '$1')
    // Standardize list items: replace *, +, - with a simple hyphen
    .replace(/^\s*[\*\-\+]\s+(.*)/gm, ' - $1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove horizontal rules (---, ***, ___)
    .replace(/^\s*[-*_]{3,}\s*$/gm, '')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove images ![alt](url)
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
    // Trim extra whitespace
    .trim();
};

/**
 * Captures an HTML element as an image and downloads it.
 * @param elementId The ID of the HTML element to capture.
 * @param fileName The name of the file to save.
 */
export const downloadChartImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    alert("Không tìm thấy biểu đồ để tải xuống.");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2, // Higher quality
      logging: false,
      useCORS: true
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${fileName}.png`);
      }
    });
  } catch (error) {
    console.error("Error capturing chart image:", error);
    alert("Không thể tải ảnh biểu đồ. Vui lòng thử lại.");
  }
};
