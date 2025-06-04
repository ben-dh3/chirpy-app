import { logOut } from "../lib/actions";

export default function Nav() {
    return (
        <div>
            <form
            action={async () => {
                'use server';
                await logOut();
            }}>
                <button className="text-sm cursor-pointer bg-primary-100 text-primary-400 p-2 rounded-2xl drop-shadow-regular">
                    <div>Sign Out</div>
                </button>
            </form>
        </div>
    )
}