import { Link } from "react-router-dom"

const PopupPage = () => {
  return (
    <div>
      Hello popup
      <br />
      <Link to="/ocr">back</Link>
      <Link to="/demo">back</Link>
    </div>
  )
}

export default PopupPage