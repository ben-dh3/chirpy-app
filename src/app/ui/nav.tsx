import { logOut } from "../lib/actions";

export default function Nav() {
    return (
        <div>
            <form
            action={async () => {
                'use server';
                await logOut();
            }}>
                <button>
                    <div>Sign Out</div>
                </button>
            </form>
        </div>
    )
}