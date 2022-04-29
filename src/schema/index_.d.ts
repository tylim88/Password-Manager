type OmitKeys<T, K extends keyof T> = Omit<T, K>

type ExcludeUnion<T, U extends T> = Exclude<T, U>

type NonNullableKey<T, K extends keyof T> = OmitKeys<T, K> &
	Required<{
		[index in K]: T[K]
	}>

type ENV = { env: { argon2_pepper: string; aes_secret: string; dev: string } }

type Secret = {
	username: string
	site: string
	password: string
}

type User = {
	encryptedPasswords: string | null
	masterPasswordHash: string
}
