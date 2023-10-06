import * as React from "react";
import "../styles.css";
const ErrorPage = () => {
  return <div>
  <h2>Request Error</h2>
  <p style={{fontSize:"20px", lineHeight: "2rem"}}>There was an error processing your request. Please contact <a href="mailto:ill@rocky.edu">ill@rocky.edu</a></p>
    
  
  
  </div>;
};

export default ErrorPage;

export const Head = () => <title>Error | RMC Library Interlibrary Loan</title>;
