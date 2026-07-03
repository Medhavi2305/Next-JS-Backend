import { auth } from "../../../auth";

export default async function Dashboard(){
    const session = await auth()

    return (session? <><button>Log In</button></> : <><button>Log Out</button></>)
}