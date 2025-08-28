import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isGenerated = true;
  isSaved = false;
  loading = false;
  title = 'MedicalWritingTool';
  selectedTemplate: string = '';
  generatedDetails:Array<any>=[
  {
    "sectionName": "Background Information",
    "files": [
      "ExternalData/Clinical Development Plan (CDP)_SourceFile.docx"
    ]
  },
  {
    "sectionName": "Benefit/Risk Assessment",
    "files": [
      "ExternalData/ExternalDocuments/Clinical Development Plan (CDP)_SourceFile.docx"
    ]
  },
  {
    "sectionName": "Study Design",
    "files": [
      "ExternalData/Clinical Development Plan (CDP)_SourceFile.docx",
      "ExternalData/PromptSource.pdf",
    ]
  },
  {
    "sectionName": "Study Population",
    "files": [
      "ExternalData/PromptSource.pdf"
    ]
  }
];
  constructor(private http: HttpClient){    
  }

  downloadTemplate() {
   
   //this.http.get('https://localhost:7206/api/document/downloadtemplate/' + this.selectedTemplate, { responseType: 'blob' }).subscribe({
   this.http.get('http://10.10.20.24:8095/api/document/downloadtemplate/' + this.selectedTemplate, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        if(blob){
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = this.selectedTemplate == 'CSR' ? 'csr_template.docx' :  'csp_template.docx';
        link.click();
        URL.revokeObjectURL(link.href);
        }
      },
      error: (err) => {
        console.error('Generation failed:', err);
      }
    });
  }

  generateDocument() {
    this.isGenerated = false;
    this.isSaved = false;
    this.loading = true;
    //this.http.get('https://localhost:7206/api/template/GenerateDocument', { responseType: 'text'  // Important: because the API returns a string
    this.http.get('http://10.10.20.24:8095/api/template/GenerateDocument', { responseType: 'text'  // Important: because the API returns a string
  }).subscribe({
      next: (response: string) => {
        this.loading = false;
        console.log('Document generation response:', response);
        this.downloadGeneratedProtocol();
        this.isGenerated = true;
        this.isSaved = true;
      },
      error: (err) => {
        this.loading = false;
        this.isGenerated = true;
        this.isSaved = false;
        console.error('Generation failed:', err);
          window.alert('There is some issue in generation');
      }
    });
  }

  downloadGeneratedProtocol() {   
   //this.http.get('https://localhost:7206/api/document/downloaddocument', { responseType: 'blob' }).subscribe({
    this.http.get('http://10.10.20.24:8095/api/document/downloaddocument', { responseType: 'blob' }).subscribe({
      next: (blob) => {
        if(blob){
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'generated_protocol.docx';
        link.click();
        URL.revokeObjectURL(link.href);
        window.alert('The protocol document is ready. Open it now?');
        }
      },
      error: (err) => {
        console.error('Generation failed:', err);
      }
    });
  }

  downloadGeneratedFile() {
       //this.http.get('https://localhost:7206/api/document/downloaddocumenturl', {
       this.http.get('http://10.10.20.24:8095/api/document/downloaddocumenturl', {
          responseType: 'text'
        }).subscribe({
          next: (url: string) => {
            window.open(url, '_blank');  // Open .docx in a new tab
          },
          error: (err) => {
            console.error('Failed to retrieve document URL:', err);
          }
        });

      // const fileUrl = encodeURIComponent('https://localhost:7206/files/csp_template_generated.docx');
      // const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${fileUrl}`;
      // window.open(officeViewerUrl, '_blank');
  }

}
