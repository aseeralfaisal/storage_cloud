import admin from 'firebase-admin';
import 'firebase-admin/storage';
import 'firebase/storage';
import ServiceAccountKey from './storageCloud.json' assert { type: 'json' };
let cloudStorage;
const initStorage = () => {
    admin.initializeApp({
        credential: admin.credential.cert(ServiceAccountKey),
        storageBucket: "gs://storage-cloud-dcca1.appspot.com"
    });
    return admin.storage();
};
cloudStorage = initStorage();
export default cloudStorage;
