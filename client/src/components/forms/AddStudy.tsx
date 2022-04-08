import React, { useState } from "react";
import { Form, Button, Checkbox, Input } from "antd";
import { useNavigate } from "react-router-dom";

const AddStudy = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    navigate("fens", { state: values });
  };
  return (
    <Form
      autoComplete="off"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      onFinish={onFinish}
      onFinishFailed={(error) => {
        console.log({ error });
        console.log(error);
      }}
    >
      <Form.Item
        name="collectionName"
        label="Study Name"
        rules={[
          {
            required: true,
            message: "Please enter the Study Name",
          },
          { whitespace: true },
          { min: 4 },
        ]}
        hasFeedback
      >
        <Input placeholder="Type the Study Name" />
      </Form.Item>
      <Form.Item
        name="by"
        label="Author"
        rules={[
          {
            required: false,
            message: "Please the Author Name",
          },
          { whitespace: true },
          { min: 4 },
        ]}
        hasFeedback
      >
        <Input placeholder="Type your name" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
          },
          { min: 6 },
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject("Password does not match criteria."),
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Type your password" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["password"]}
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                "The two passwords that you entered does not match."
              );
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Confirm your password" />
      </Form.Item>
      {/* <Form.Item
        name="agreement"
        wrapperCol={{ span: 24 }}
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    "To proceed, you need to agree with our terms and conditions"
                  ),
          },
        ]}
      >
        <Checkbox>
          {" "}
          Agree to our <a href="#">Terms and Conditions</a>
        </Checkbox>
      </Form.Item> */}
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button block type="primary" htmlType="submit">
          Submit Study
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddStudy;