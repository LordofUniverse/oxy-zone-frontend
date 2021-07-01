import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

import { Nav, Navbar } from "react-bootstrap";

import SaveIcon from "@material-ui/icons/Save";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import axios from "axios";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Styles = styled.div`
  position: sticky;
  top: 0;

  .navbar {
    background-color: #222;
  }

  a,
  .navbar-brand,
  .navbar-nav .nav-link {
    color: #bbb !important;
    &:hover {
      color: white !important;
      text-decoration: none !important;
    }
  }
`;

const Update = () => {
  const history = useHistory();

  const [changedtext, setchangedtext] = useState(false);
  const [prof, setprof] = useState([]);
  const [img, setimg] = useState("");
  const [textbox, settextbox] = useState("");
  const [urlav, seturlav] = useState(false);
  const [url, seturl] = useState("");
  const [eye, seteye] = useState(true);
  const [eye2, seteye2] = useState(true);
  const [eye3, seteye3] = useState(true);

  const handlesubmit = (e) => {
    e.preventDefault();

    let nam = e.target[0].value;
    let emai = e.target[1].value;
    let oldp = e.target[2].value;
    let newp = e.target[3].value;
    let retp = e.target[4].value;

    console.log(prof);

    console.log(
      prof[0],
      "||",
      nam,
      "||",
      emai,
      "||",
      prof[6],
      "||",
      prof[7],
      "||",
      oldp,
      "||",
      newp,
      "||",
      retp,
      "||",
      img,
      "||",
      textbox
    );

    //id, name, email, pwd, imgloc, desc
    //setdet([val[0], val[1], val[2], val[3], val[4], val[5]])

    //id, name, email, pwd, imgloc, desc, name, email, pwd, imgloc
    //setprof([val[0], val[1], val[2], val[3], val[4], val[5], val[1], val[2], val[3], val[4]])

    if (nam === "" || emai === "") {
      alert("Dont Leave the name or email empty!");
    } else if (newp === "" && oldp === "" && retp === "") {
      const uploadData = new FormData();

      if (!(nam === prof[6] && emai === prof[7]) || urlav || changedtext) {
        if (urlav) {
          uploadData.append("id", prof[0]);
          uploadData.append("name", nam);
          uploadData.append("email", emai);
          uploadData.append("oldname", prof[6]);
          uploadData.append("oldemail", prof[7]);
          uploadData.append("cond", "no");
          uploadData.append("cond2", "yes");
          uploadData.append("oldpassword", "");
          uploadData.append("newpassword", "");
          uploadData.append("profilephoto", img, img.name);
          uploadData.append("desc", textbox);
        } else {
          uploadData.append("id", prof[0]);
          uploadData.append("name", nam);
          uploadData.append("email", emai);
          uploadData.append("oldname", prof[6]);
          uploadData.append("oldemail", prof[7]);
          uploadData.append("cond", "no");
          uploadData.append("cond2", "no");
          uploadData.append("oldpassword", "");
          uploadData.append("newpassword", "");
          uploadData.append("profilephoto", "");
          uploadData.append("desc", textbox);
        }

        axios
          .post("http://oxy-zone.herokuapp.com/api/sellers/update/", uploadData)
          .then((res) => {
            if (res.status === 200) {
              console.log(res.data.Data[0]);
              setimg("/media/" + res.data.Data[0]);
              seturlav(false);
              seturl(false);
              localStorage.removeItem("gid");
              console.log([
                prof[0],
                prof[1],
                prof[2],
                res.data.Data[1],
                "/media/" + res.data.Data[0],
                textbox,
              ]);
              localStorage.setItem("gid", [
                prof[0],
                prof[1],
                prof[2],
                res.data.Data[1],
                "/media/" + res.data.Data[0],
                textbox,
              ]);

              //id, name, email, pwd, imgloc, desc, name, email, pwd, imgloc
              setprof([
                prof[0],
                prof[1],
                prof[2],
                prof[3],
                prof[4],
                prof[5],
                prof[1],
                prof[2],
                prof[3],
                prof[4],
              ]);

              alert("Details updated successfuly!");
            } else if (res.status === 226) {
              alert(
                "This email is already taken by someone! Please try some other email!"
              );
            } else {
              alert("something wrong! try again");
            }
          })
          .catch((error) => console.log(error));
      }
      
    } else if (newp === retp) {
      const uploadData = new FormData();

      if (urlav) {
        uploadData.append("id", prof[0]);
        uploadData.append("name", nam);
        uploadData.append("email", emai);
        uploadData.append("oldname", prof[6]);
        uploadData.append("oldemail", prof[7]);
        uploadData.append("cond", "yes");
        uploadData.append("cond2", "yes");
        uploadData.append("oldpassword", oldp);
        uploadData.append("newpassword", newp);
        uploadData.append("profilephoto", img, img.name);
        uploadData.append("desc", textbox);
      } else {
        uploadData.append("id", prof[0]);
        uploadData.append("name", nam);
        uploadData.append("email", emai);
        uploadData.append("oldname", prof[6]);
        uploadData.append("oldemail", prof[7]);
        uploadData.append("cond", "yes");
        uploadData.append("cond2", "no");
        uploadData.append("oldpassword", oldp);
        uploadData.append("newpassword", newp);
        uploadData.append("profilephoto", "");
        uploadData.append("desc", textbox);
      }

      axios
        .post("http://oxy-zone.herokuapp.com/api/sellers/update/", uploadData)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.Data[0]);
            setimg("/media/" + res.data.Data[0]);
            seturlav(false);
            seturl(false);
            localStorage.removeItem("gid");
            console.log(prof[3], res.data.Data[1]);
            console.log([
              prof[0],
              prof[1],
              prof[2],
              res.data.Data[1],
              "/media/" + res.data.Data[0],
              textbox,
            ]);
            localStorage.setItem("gid", [
              prof[0],
              prof[1],
              prof[2],
              res.data.Data[1],
              "/media/" + res.data.Data[0],
              textbox,
            ]);

            //id, name, email, pwd, imgloc, desc, name, email, pwd, imgloc
            setprof([
              prof[0],
              prof[1],
              prof[2],
              prof[3],
              prof[4],
              prof[5],
              prof[1],
              prof[2],
              prof[3],
              prof[4],
            ]);

            alert("Details updated successfuly!");
          } else if (res.status === 226) {
            alert(
              "This email is already taken by someone! Please try some other email!"
            );
          } else {
            alert("Something wrong.. try again!");
          }
        })
        .catch((error) => console.log(error));
    } else {
      alert("Passwords doesn't match!");
    }
  };

  const handleclick = () => {
    localStorage.removeItem("gid");
    window.location.reload();
  };

  useEffect(() => {
    const val = localStorage.getItem("gid").split(",");
    console.log(val);

    //setdet([val[0], val[1], val[2], val[3], val[4]])
    //id, name, email, pwd, imgloc, desc, name, email, pwd, imgloc
    setprof([
      val[0],
      val[1],
      val[2],
      val[3],
      val[4],
      val[5],
      val[1],
      val[2],
      val[3],
      val[4],
    ]); //here, img and desc is not updated

    console.log(val[4]);

    setimg(val[4]); //this is img

    settextbox(val[5]); //this is textbox area
  }, []);

  return prof.length >= 1 ? (
    <>
      {/* <div id="map" style = {{ visibility: 'hidden' }} ></div> */}

      <Styles>
        <Navbar expand="lg">
          <Navbar.Brand href="/">Ozone</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Item>
                <Nav.Link>
                  <Link to="/vaccinationlist">Vaccination List</Link>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link>
                  <div onClick={handleclick}>Log Out</div>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link>
                  <div
                    onClick={() => {
                      history.goBack();
                    }}
                  >
                    Go Back
                  </div>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Styles>

      <FirstHalf>
        <LeftHalf>
          <Round>
            <input
              type="file"
              id="imageupload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => {
                try {
                  setimg(e.target.files[0]);
                  const file = e.target.files[0];
                  seturlav(true);
                  seturl(URL.createObjectURL(file));
                } catch (e) {
                  console.log(e);
                }
              }}
            />

            {urlav ? (
              <Roundimg
                src={url}
                onClick={() => {
                  document.getElementById("imageupload").click();
                }}
              />
            ) : (
              <Roundimg
                src={"https://oxy-zone.herokuapp.com" + img}
                onClick={() => {
                  document.getElementById("imageupload").click();
                }}
              />
            )}
          </Round>
        </LeftHalf>

        <RightHalf>
          <h5 style={{ textAlign: "center", marginBottom: "20px" }}>
            Leave the password boxes empty if you dont want to change the
            password
          </h5>

          <form
            onSubmit={(e) => {
              handlesubmit(e);
            }}
          >
            <div class="input-group mb-3">
              <span
                style={{ width: "65px" }}
                class="input-group-text"
                id="inputGroup-sizing-default"
              >
                Name
              </span>
              <input
                value={prof[1]}
                onChange={(e) => {
                  setprof([
                    prof[0],
                    e.target.value,
                    prof[2],
                    prof[3],
                    prof[4],
                    prof[5],
                    prof[6],
                    prof[7],
                    prof[8],
                    prof[9],
                  ]);
                }}
                type="text"
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>

            <div class="input-group mb-3">
              <span
                style={{ width: "65px" }}
                class="input-group-text"
                id="inputGroup-sizing-default"
              >
                Email
              </span>
              <input
                value={prof[2]}
                onChange={(e) => {
                  setprof([
                    prof[0],
                    prof[1],
                    e.target.value,
                    prof[3],
                    prof[4],
                    prof[5],
                    prof[6],
                    prof[7],
                    prof[8],
                    prof[9],
                  ]);
                }}
                type="text"
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>

            <div class="input-group mb-3">
              <span
                style={{ width: "145px" }}
                class="input-group-text"
                id="inputGroup-sizing-default"
              >
                Old Password
              </span>
              <input
                type={eye ? "password" : "text"}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <span
                onClick={() => {
                  eye ? seteye(false) : seteye(true);
                }}
                class="input-group-text"
                id="basic-addon1"
              >
                {" "}
                {eye ? <VisibilityIcon /> : <VisibilityOffIcon />}{" "}
              </span>
            </div>

            <div class="input-group mb-3">
              <span
                style={{ width: "145px" }}
                class="input-group-text"
                id="inputGroup-sizing-default"
              >
                New Password
              </span>
              <input
                type={eye2 ? "password" : "text"}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <span
                onClick={() => {
                  eye2 ? seteye2(false) : seteye2(true);
                }}
                class="input-group-text"
                id="basic-addon1"
              >
                {" "}
                {eye2 ? <VisibilityIcon /> : <VisibilityOffIcon />}{" "}
              </span>
            </div>

            <div class="input-group mb-3">
              <span
                style={{ width: "145px" }}
                class="input-group-text"
                id="inputGroup-sizing-default"
              >
                Retype Password
              </span>
              <input
                type={eye3 ? "password" : "text"}
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <span
                onClick={() => {
                  eye3 ? seteye3(false) : seteye3(true);
                }}
                class="input-group-text"
                id="basic-addon1"
              >
                {" "}
                {eye3 ? <VisibilityIcon /> : <VisibilityOffIcon />}{" "}
              </span>
            </div>

            <input id="hid" type="submit" style={{ display: "none" }} />

            <Save
              onClick={() => {
                document.getElementById("hid").click();
              }}
            >
              <SaveIcon fontSize="large" style={{ color: "white" }} />
            </Save>
          </form>
        </RightHalf>
      </FirstHalf>

      <SecondHalf>
        <h2> About You: </h2>
        <Textarea
          value={textbox}
          onChange={(e) => {
            settextbox(e.target.value);
            setchangedtext(true);
          }}
        />
      </SecondHalf>
    </>
  ) : (
    <p>Loading</p>
  );
};

const FirstHalf = styled.div`
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const LeftHalf = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightHalf = styled.div`
  height: 100%;
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Round = styled.div`
  height: 200px;
  width: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &: hover {
    cursor: pointer;
  }
`;

const Roundimg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid black;
  // overflow: hidden;
  object-fit: cover;
`;

const Save = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1685f1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 10px;
  right: 10px;

  &: hover {
    cursor: pointer;
  }
`;

const SecondHalf = styled.div`
  width: 100%;
  padding: 15px;
  height: ${window.innerHeight / 2 - 56}px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Textarea = styled.textarea`
  height: 90%;
  width: 90%;
`;

export default Update;
