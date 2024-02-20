export class ContactInformationViewModel {
  id: string;
  label: string;
  value: string;
}

export class ContactInformationType {

  public static phoneContactLabels() {
    return ['Mobile Number', 'Office Number', 'Fax', 'Other'];
  }

  public static externalLinkLabels() {
    return ['Dropbox', 'Facebook', 'Google Drive', 'Hangouts', 'Linkedin', 'Skype', 'Twitter', 'Website', 'Whatsapp', 'Zoom', 'Other'];
  }

}

export const webAddresText = 'Website';
