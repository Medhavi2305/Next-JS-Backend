import { signIn } from "../../auth";

export default function SignIn(){
    return (
        <form
        action={async (FormData) => {
            "use server"
            await signIn('credentials', FormData)
        }}
        >
            <label>
                Username
                <input name="Username" type="text"/>
            </label>
            <label>
                password
                <input name="Password" type="text"/>
            </label>
            <button>Sign In</button>
        </form>
    )
}