import dayjs from 'dayjs';
import SqlLiteApi from '../services/SqlLiteApi';
import {ContactItem} from '../types';

export function getSavedContacts(load: boolean) {
  if (!load) {
    console.log('ans data');
    return Promise.resolve([]);
  }
  return SqlLiteApi.getMany<ContactItem>({email: '*'}, {tableName: 'contacts'});
}

function getPrefixAndNumber(phoneNumber: string) {
  const regExp = /^(\+?[1-9]{1,3}|0)(\d+)/g;
  const matches = regExp.exec(phoneNumber);
  if (!matches || matches.length !== 3) {
    return {
      phone_prefix: 'none',
      phone: phoneNumber,
      contact_id: phoneNumber,
    };
  } else {
    let prefix = matches[1];
    let phone = matches[2];
    let id = matches[0];
    if (prefix === '0') {
      prefix = '+234';
      id = prefix + id.slice(1);
    }
    if (!prefix.startsWith('+')) {
      prefix = '+' + prefix;
    }
    if (!id.startsWith('+')) {
      id = '+' + id;
    }

    return {
      phone_prefix: prefix,
      phone,
      contact_id: id,
    };
  }
}

export function getUniqueContacts(contacts: ContactItem[]) {
  let arr: ContactItem[] = [];
  for (let item of contacts) {
    // console.log(item.contact_id)
    let contact = getPrefixAndNumber(item.contact_id);
    if (contact.phone.length >= 3) {
      arr.push({...contact, name: item.name});
    }
  }
  return arr;
}

export function formatDate2(
  date: number | Date,
  add: Record<string, number> = {minute: 1},
  format = 'MMMM DD, YYYY',
) {
  let day = typeof date === 'number' ? dayjs(date) : dayjs(date.getTime());
  if (!day) {
    return 'Error';
  }
  if (add) {
    const keys = Object.keys(add);
    day = day.add(add[keys[0]], keys[0] as any);
  }
  return day.format(format);
}
