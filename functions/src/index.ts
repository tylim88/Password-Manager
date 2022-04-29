import 'regenerator-runtime/runtime' // https://stackoverflow.com/a/51650116/5338829

import * as api from 'api'
import { allSchema } from 'schema'

// make sure all function names are correct
allSchema.forEach(schema => {
	const name = schema.name.value
	// typescript type checking able to find out the wrong function name
	api[name] // type error if function name is incorrect

	// if function name is incorrect and deploy to function, it will throw CORS error upon calling it because it simply doesn't exist

	// if you want to check function name without relying on type checking, this is how you do it
	// if (!api[name]) {
	// 	throw Error(`api ${name} does not exist, possible name typo`)
	// }
})

export * from 'api'
