import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { editLocationState } from "../../types";
import Chessground from "@react-chess/chessground";

import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Card, Row, Col, Button, message } from "antd";

const boardWidth = 150;

const EditFens = () => {
  const location = useLocation();
  const { id, password } = location.state as editLocationState; // Type Casting, then you can get the params passed via router
  const [fens, setFens] = useState<any>([]);
  console.log(id, password);

  useEffect(() => {
    const fetch = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.get(`/api/fens/${id}`, config);
        setFens(data.data.fens);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  const onDeleteFen = (index: number) => {
    const deleteFen = async () => {
      try {
        await axios.put(`/api/fens/${id}`, index).then((res) => {
          setFens(() => {
            return fens.slice(index, 1);
          });
          console.log("success!");
        });
      } catch (error) {
        console.log(error);
      }
    };

    deleteFen();
  };
  const onEditFen = (index: number) => {
    const editFen = async () => {
      try {
        await axios.put(`/api/fens/${id}`, index).then((res) => {
          setFens(() => {
            return fens.slice(index, 1);
          });
          console.log("success!");
        });
      } catch (error) {
        console.log(error);
      }
    };

    editFen();
  };

  /* if (fens.length === 0) return <h1>Loading...</h1>; */
  return (
    <>
      <h1>Review your study</h1>
      <Row gutter={[24, 24]}>
        {fens?.map(
          (
            fen: {
              _id: string;
              fen: string;
              description: string;
              san: string;
            },
            index: number
          ) => (
            <Col xs={24} sm={12} lg={6} className="fen-card" key={fen._id}>
              <Card>
                <p>
                  <Chessground
                    height={boardWidth}
                    width={boardWidth}
                    config={{ fen: fen?.fen, coordinates: false }}
                  />
                </p>
                <p>
                  <strong>Description:</strong>
                  {fen.description}
                </p>
                <p>
                  <strong>Correct move:</strong>
                  {fen.san}
                </p>
                <Button onClick={() => onDeleteFen(index)}>Delete</Button>
                {/* edit modal */}
                <ModalForm<{
                  name: string;
                  company: string;
                }>
                  title="Edit Position"
                  trigger={<Button type="primary">Edit</Button>}
                  autoFocusFirstInput
                  modalProps={{
                    onCancel: () => console.log("run"),
                  }}
                  onFinish={async (values) => {
                    console.log(values.name);
                    message.success("提交成功");
                    return true;
                  }}
                >
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="fen"
                      label="Fen's Position"
                      tooltip="最长为 24 位"
                      placeholder="fen"
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormTextArea
                      width="xl"
                      name="description"
                      label="Description"
                      placeholder="请输入名称"
                    />
                    <Chessground
                      width={400}
                      height={400}
                      config={{ coordinates: false }}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="san"
                      label="Correct Move"
                      tooltip="最长为 24 位"
                      placeholder="san"
                    />
                  </ProForm.Group>
                </ModalForm>
              </Card>
            </Col>
          )
        )}
      </Row>
    </>
  );
};

export default EditFens;