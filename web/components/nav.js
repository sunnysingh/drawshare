import Link from "next/link";

const Nav = () => (
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

export default Nav;
