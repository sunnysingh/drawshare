import Link from "next/link";
import { FunctionComponent } from "react";

export const Nav: FunctionComponent = () => (
  <nav>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/auth/register">
          <a>Register</a>
        </Link>
      </li>
    </ul>
  </nav>
);
