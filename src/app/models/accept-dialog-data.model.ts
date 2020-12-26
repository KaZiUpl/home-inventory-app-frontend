export class AcceptDialogData {
    title: string;
    content: string;
    acceptButtonText?: string;
    cancelButtonText?: string;
    constructor() {
        this.title = '';
        this.content = '';
        this.acceptButtonText = 'Confirm';
        this.cancelButtonText =  'Cancel';
    }
}