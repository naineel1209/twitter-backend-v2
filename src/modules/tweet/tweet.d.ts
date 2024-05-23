export type ICreateTweet = {
    tweet: string
    userId: number
}

export type IUpdateTweet = {
    tweet?: string
    like?: boolean
    delete?: boolean
    tweetId: number
    userId: number
}

export type IDeleteTweet = {
    tweetId: number
    userId: number
}

// Define an interface representing the structure of the user object
interface User {
    user_id: string; // Adjust the type accordingly (e.g., number, string, etc.)
    // Add other properties if needed
}

// Now, augment the Express namespace to include the updated user property
declare module 'express-serve-static-core' {
    interface Request {
        user: User; // Use the interface defined above
    }
}
