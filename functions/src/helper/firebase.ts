import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

admin.initializeApp()
export const db = admin.firestore()

export const ENV: ENV['env'] = functions.config().env
