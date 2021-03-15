import { FunctionComponent, ReactNode } from "react";
import NextLink from "next/link";
import {
  Container,
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

import { useAuthContext } from "contexts/auth";
import { api } from "api";

const LINKS = [
  {
    label: "Gallery",
    href: "/",
  },
  {
    label: "Draw",
    href: "/draw",
    isAuthenticatedOnly: true,
  },
];

type NavLinkProps = {
  children: ReactNode;
  href: string;
};

const NavLink: FunctionComponent<NavLinkProps> = ({ children, href }) => (
  <NextLink href={href} passHref>
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
    >
      {children}
    </Link>
  </NextLink>
);

export function Nav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useAuthContext();

  const renderNavLink = ({
    href,
    label,
    isAuthenticatedOnly,
  }: {
    href: string;
    label: string;
    isAuthenticatedOnly?: boolean;
  }) => {
    if (isAuthenticatedOnly && !user.isAuthenticated) return null;
    return (
      <NavLink key={`${href}-${label}`} href={href}>
        {label}
      </NavLink>
    );
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Container maxW="container.xl">
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: !isOpen ? "none" : "inherit" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <NextLink href="/">
                <a>Drawshare</a>
              </NextLink>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {LINKS.map(renderNavLink)}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              {user.isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                  >
                    <Avatar size={"sm"} name={user.email} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>{user.email}</MenuItem>
                    <MenuItem
                      onClick={() => {
                        api.logout();
                        location.reload();
                      }}
                    >
                      Sign out
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <NextLink href="/auth/login" passHref>
                    <Button
                      as="a"
                      variant={"outline"}
                      colorScheme={"teal"}
                      size={"sm"}
                      mr={4}
                    >
                      Sign in
                    </Button>
                  </NextLink>
                  <NextLink href="/auth/register" passHref>
                    <Button
                      as="a"
                      variant={"solid"}
                      colorScheme={"teal"}
                      size={"sm"}
                      mr={4}
                    >
                      Register
                    </Button>
                  </NextLink>
                </>
              )}
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4}>
              <Stack as={"nav"} spacing={4}>
                {LINKS.map(renderNavLink)}
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>
    </>
  );
}
