import React, { useEffect, useState } from "react";
import Chessground from "@react-chess/chessground";
import { Button, Form, FormInstance, Input, message } from "antd";
import axios from "axios";
import { ChessInstance } from "chess.js";
import { toColor } from "../../utils/chessUtils";
import { Fens } from "../../types";

const Chessjs = require("chess.js");

const validFenRegex = new RegExp(
  /\s*([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw-]\s(([a-hkqA-HKQ]{1,4})|(-))\s(([a-h][36])|(-))\s\d+\s\d+\s*/
);

const { Item } = Form;

interface PropsInterface {
  form?: FormInstance;
  setFens(arg: Fens[]): void;
  password: string | undefined;
  id: string;
  type: "add" | "edit";
  index?: number;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isModalVisible?: boolean;
}

const FormComponent = (props: PropsInterface) => {
  //validate move
  const { form, setFens, password, id, type, index, setIsModalVisible } = props;

  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [_fen, setFen] = useState<string>("");

  const validateMove = (value: string) => {
    chess.load(_fen as string);
    let _chess = chess;
    return _chess.move(value) !== null;
  };

  //on edit modal
  const onEditFen = (values: {
    description: string;
    fen: string;
    san: string;
  }) => {
    const editFen = async () => {
      try {
        await axios
          .put(`/api/fens/edit/${id}`, {
            private: password,
            san: values.san,
            fen: values.fen,
            description: values.description,
            index: index,
          })
          .then((res) => {
            setFens(res.data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    editFen();
  };
  //on Add
  const onAddFen = (values: {
    fen: string;
    description: string | undefined;
    san: string;
  }) => {
    const editFen = async () => {
      try {
        if (values.description === undefined) values.description = "";
        await axios
          .put(`/api/fens/edit/fen/${id}`, {
            private: password,
            san: values.san,
            fen: values.fen,
            description: values.description,
          })
          .then((res) => {
            setFens(res.data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    editFen();
  };
  //resposonsive stuff
  const [windowDimension, setWindowDimension] = useState(0);

  useEffect(() => {
    setWindowDimension(window.innerWidth);
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      <Form
        form={form}
        autoComplete="off"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        onFinish={(values) => {
          if (type === "add") {
            onAddFen(values);
            message.success(`Position added successfully`);
          } else {
            onEditFen(values);
            message.success(`Position edited successfully`);
          }
          setIsModalVisible(false);
        }}
        onFinishFailed={(error) => {
          console.log({ error });
          console.log(error);
        }}
      >
        <Form.Item
          name="fen"
          label="Fen"
          tooltip="add a valid position in Forsyth-Edwards Notation"
          rules={[
            {
              required: true,
              message: "Please insert a position you want to study",
            },
            { whitespace: true },
            {
              validator: (_, value) =>
                value && chess.validate_fen(value).valid
                  ? Promise.resolve()
                  : Promise.reject("Fen is not valid."),
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder="Type the Position you want to study"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (validFenRegex.test(e.target.value) === true) {
                setFen(e.target.value);
                chess.load(e.target.value);
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          tooltip="add a description to understand the position better. It would be a good idea keeping it brief and simple."
          rules={[
            {
              required: false,
            },
            { min: 2 },
          ]}
          hasFeedback
        >
          <Input placeholder="Type an explanation of the answer" />
        </Form.Item>
        <Form.Item
          name="san"
          label="Answer in san"
          tooltip="the best move for the position."
          dependencies={["fen"]}
          rules={[
            {
              required: true,
            },
            {
              validator(_, value) {
                if (!value || validateMove(value)) {
                  return Promise.resolve();
                }
                return Promise.reject("This isn't a valid san.");
              },
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Type the right move in san notation" />
        </Form.Item>

        <Item shouldUpdate noStyle>
          {() => {
            let fen =
              "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            if (type === "edit") fen = form?.getFieldValue("fen");
            if (type === "add" && form?.getFieldValue("fen") !== undefined) {
              fen = form?.getFieldValue("fen");
            }

            if (fen !== undefined) {
              chess.load(fen);
            }

            return (
              <div
                style={{
                  margin: "0 auto",
                  width: windowDimension >= 470 ? 400 : windowDimension - 70,
                  height: windowDimension >= 470 ? 400 : windowDimension - 70,
                }}
              >
                <Chessground
                  contained
                  config={{
                    fen,
                    coordinates: true,
                    viewOnly: true,
                    orientation: toColor(chess),
                  }}
                />
              </div>
            );
          }}
        </Item>
        <br></br>
        <br></br>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button block type="primary" htmlType="submit">
            Save Position
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormComponent;
