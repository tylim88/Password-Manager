import React from 'react'
import { Center, Text, Stack } from '@mantine/core'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth } from 'firebaseHelper'
import {
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
	TwitterAuthProvider,
	OAuthProvider,
} from 'firebase/auth'

const MicrosoftAuthProvider = new OAuthProvider('microsoft.com')
const YahooAuthProvider = new OAuthProvider('yahoo.com')

export const Login = () => {
	return (
		<Center sx={{ height: '100%' }}>
			<Stack>
				<Text>only Google Auth works, the rest are just example</Text>
				<StyledFirebaseAuth
					uiConfig={{
						signInFlow: 'popup',
						signInSuccessUrl: '/',
						signInOptions: [
							{
								customParameters: { prompt: 'select_account' },
								provider: GoogleAuthProvider.PROVIDER_ID,
							},
							FacebookAuthProvider.PROVIDER_ID,
							GithubAuthProvider.PROVIDER_ID,
							TwitterAuthProvider.PROVIDER_ID,
							MicrosoftAuthProvider.providerId,
							YahooAuthProvider.providerId,
						],
					}}
					firebaseAuth={auth}
				/>
			</Stack>
		</Center>
	)
}
