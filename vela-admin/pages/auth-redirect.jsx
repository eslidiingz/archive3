import React, { useContext, useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function IndexPage() {
	const { data: session, status } = useSession();

	useEffect(
		function () {
			window.location.href = "/";
		},
		[status]
	);

	return (
		<div>
			{status}
			{status == "authenticated" && (
				<>
					<div>{status}</div>
					<div>{session.user.email}</div>
					<div>{session.user.name}</div>
					<div>{session.user.picture}</div>
					<div>{session.user.sub}</div>
				</>
			)}
		</div>
	);
}
