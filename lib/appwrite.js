import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.Aora',
    projectId: '6792900d001ac36ee1cf', 
    databaseId: '6792923e00385289ea9f',
    userCollectionId: '67929262003616d4d2cf',
    videoCollectionId: '679292a3000bd2e4d7f1',
    storageId: '6792942c000e0470a1df',
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;


const account = new Account(client);
const avatars = new Avatars(client);
const dataBases = new Databases(client);

export const createUser = async (email, password, username) => {
    // Register User
    try {
        const newAccount = await account.create(
            ID.unique(),
            email, 
            password, 
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        console.log(newAccount);

        const newUser = await dataBases.createDocument(
            config.databaseId,
            config.userCollectionId, 
            ID.unique(), 
            {
                accountid: newAccount.$id,
                email, 
                username, 
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error){
        console.log("sign-up: "+ error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try{
        const session = await account.createEmailPasswordSession(email, password)

        return session

    } catch (error){
        console.log("sign-In: "+ error);
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        console.log(currentAccount);

        const currentUser = await dataBases.listDocuments(
            config.databaseId, 
            config.userCollectionId, 
            [Query.equal('accountid', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error){
        console.log("getUser: " + error);
    }
}

