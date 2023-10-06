import * as React from "react";
import '../styles.css'
const SuccessPage = () => {
  return <div>
    <h2>Success!</h2>
    <p style={{fontSize:"20px", lineHeight: "2rem"}}>Thank you for your interlibrary loan request. <br /><br /> Questions? <a href="mailto:ill@rocky.edu">ill@rocky.edu</a>
    <br /><br />
    <h3>Typical delivery windows:</h3>
    <ul>
    
      <li>Books: one week</li>
      <li>Journal articles: two days</li>
    </ul>
    </p>
  </div>;
};

export default SuccessPage;

export const Head = () => <title>Successful Request | RMC Library Interlibrary Loan</title>;
