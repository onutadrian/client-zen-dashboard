
import { GeneratedDocument } from '@/services/contractTemplateService';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const useDocumentDownload = () => {
  const downloadDocument = async (document: GeneratedDocument) => {
    try {
      // Split content into paragraphs
      const paragraphs = document.generated_content.split('\n').map(line => 
        new Paragraph({
          children: [new TextRun(line || ' ')], // Empty lines need a space
        })
      );

      // Create Word document
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      // Generate blob
      const blob = await Packer.toBlob(doc);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.document_name}.docx`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Word document:', error);
    }
  };

  return { downloadDocument };
};
