//todo: make a complex search (by name,number of positions,etc..)

import React, { useState, useEffect } from "react";
import axios from "axios";
import Chessground from "@react-chess/chessground";
import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Input } from "antd";
import Loader from "../utils/Loader";
import { PlayState } from "../types";
import { PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

const Collections = () => {
  const navigate = useNavigate();
  const [fens, setFens] = useState<PlayState[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetch = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.get("/api/fens", config);
        setFens(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  if (fens.length === 0) return <Loader />;
  return (
    <>
      <br />
      <Row gutter={[16, 16]}>
        <Col span={4} />
        <Col span={16}>
          <Button
            icon={<PlusOutlined />}
            type={"primary"}
            onClick={() => navigate("/add-study")}
          >
            {/*      <PlusOutlined /> */}
            Add a Study
          </Button>
        </Col>
        <Col span={4} />

        <Col span={4} />
        <Col span={16}>
          <Search
            placeholder="Search by Study Name"
            /* onSearch={onSearch} */
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            enterButton
          />
        </Col>
        <Col span={4} />
      </Row>
      <br />

      <div style={{ padding: "20px" }}>
        <Row gutter={[24, 24]}>
          {fens
            ?.filter((fen: PlayState) => {
              if (searchTerm == "") return fen;
              else if (
                fen.collection_name
                  .toLowerCase()
                  .includes(searchTerm.toLocaleLowerCase())
              )
                return fen;
            })
            .map((fen: PlayState) => (
              <Col xs={24} sm={12} lg={6} className="fen-card" key={fen._id}>
                <Link to={`/study/${fen._id}`}>
                  <Card
                    title={`${fen.collection_name}. `}
                    extra={`by ${fen.by}. `}
                    hoverable
                  >
                    <p>
                      {fen?.fens[0] !== undefined ? (
                        <div className="collection-board">
                          <Chessground
                            contained
                            config={{
                              fen: fen?.fens[0].fen,
                              coordinates: false,
                              viewOnly: true,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="collection-board">
                          <Chessground
                            contained
                            config={{ coordinates: false, viewOnly: true }}
                          />
                        </div>
                      )}
                    </p>
                    <div style={{ textAlign: "center" }}>
                      <p>Number of Positions to study: {fen.fens.length}</p>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
        </Row>
      </div>
    </>
  );
};

export default Collections;
