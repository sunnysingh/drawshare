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

const LINKS = [
  {
    label: "Home",
    href: "/",
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
              <Box>Drawshare</Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {LINKS.map(({ href, label }) => (
                  <NavLink key={`${href}-${label}`} href={href}>
                    {label}
                  </NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
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
              {/* <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
              >
                <Avatar size={"sm"} name="Sunny Singh" />
              </MenuButton>
              <MenuList>
                <MenuItem>Sign out</MenuItem>
              </MenuList>
            </Menu> */}
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4}>
              <Stack as={"nav"} spacing={4}>
                {LINKS.map(({ href, label }) => (
                  <NavLink key={`${href}-${label}`} href={href}>
                    {label}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>
    </>
  );
}
