import { createAuthClient } from "better-auth/react"
import { magicLinkClient, inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
    plugins: [
        magicLinkClient(),
        inferAdditionalFields({
            user: {
                phone: { type: 'string', required: false },
                isAdmin: { type: 'boolean', required: false },
            },
        }),
    ],
})
