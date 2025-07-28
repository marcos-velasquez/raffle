import PocketBase from 'pocketbase';
import { TypedPocketBase } from '@pocketbase';
import { environment } from '@env/environment';

const pb = new PocketBase(environment.POCKETBASE_URL) as TypedPocketBase;

export { pb };
