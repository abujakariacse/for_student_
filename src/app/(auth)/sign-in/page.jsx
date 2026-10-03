"use client";

import { useState } from "react";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";

import { signIn } from "@/lib/auth-client";

import { Eye, EyeSlash, Link } from "@gravity-ui/icons";

const SignInPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("form er data", data);

    const { data: resData, error } = await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    });

    console.log("after submit", resData, error);
  };

  return (
    <div>
      <h2>Please Sign in</h2>

      <Form
        className="flex w-96 flex-col gap-4"
        onSubmit={onSubmit}
      >
        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => {
            if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
            ) {
              return "Please enter a valid email address";
            }

            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder="john@example.com" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          name="password"
          validate={(value) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters";
            }

            return null;
          }}
        >
          <Label>Password</Label>

          <InputGroup>
            <InputGroup.Input
              name="password"
              type={isVisible ? "text" : "password"}
              placeholder="Enter your password"
            />

            <InputGroup.Suffix className="pe-0">
              <Button
                type="button"
                isIconOnly
                aria-label={
                  isVisible ? "Hide password" : "Show password"
                }
                size="sm"
                variant="ghost"
                onPress={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeSlash className="size-4" />
                )}
              </Button>
            </InputGroup.Suffix>
          </InputGroup>

          <Description>
            Password must be at least 8 characters
          </Description>

          <FieldError />
        </TextField>

        <div className="flex gap-2">
          <Button type="submit">
            Submit
          </Button>

          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
      </Form>
      <p>
        <small>
          Forgot password? 
          <a
            className="text-blue-500 hover:underline"
            href="/forgot-password"
          >
            click here
          </a>
        </small>
      </p>
    </div>
  );
};

export default SignInPage;