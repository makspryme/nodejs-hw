import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';
const contactPath = path.resolve('models', 'contacts.json');

const stringyfyContacts = (contacts) =>
  fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));

export const listContacts = async () => {
  const contacts = await fs.readFile(contactPath);

  return JSON.parse(contacts);
};

export const getContactById = async (id) => {
  console.log('id: ', id);
  const contacts = await listContacts();
  const contactId = await contacts.find((item) => item.id === id);
  return contactId;
};

export const addContact = async (data) => {
  const newContact = {
    id: nanoid(),
    ...data,
  };

  const contacts = await listContacts();
  contacts.push(newContact);

  await stringyfyContacts(contacts);
  return newContact;
};

export const removeContact = async (id) => {
  const contacts = await listContacts();

  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [contact] = contacts.splice(index, 1);

  await stringyfyContacts(contacts);

  return contact;
};

export const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return;
  }

  contacts.splice(index, 1, newContact);

  await stringyfyContacts(contacts);

  return contacts;
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
