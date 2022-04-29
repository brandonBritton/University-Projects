import './TermsAndConditions.css'




const TermsAndConditions = () => {
    return (
        <div className='Terms_container'>
        <div style = {{color: "#0E5F76", maxWidth: '100%'}}>

            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%",width:"100%"}}>Terms & Conditions</h1>
            <h1 style = {{textAlign: "center", color: "#0E5F76", padding: "2%",width:"100%"}}>COVID Guard Terms & Conditions</h1>
            
            <div >
            <text className='terms_text_one'>
                We provide information about the
                Department of Health and its responsibilities
                 for the benefit of all Australians.
                 While we make every effort to make sure the
                 information in this website is accurate and informative,
                 the information does not take the place of professional or
                 medical advice.
            </text>
            </div>

            <div >
            <text className='terms_text_two'>
            
            <span style ={{fontWeight:"bold",textAlign: "left"}}id='terms_text_two_title'>Do not use our information:</span><br/>
            <span >to diagnose, treat, cure or prevent any disease </span>  <br/>
            <span >for therapeutic purposes</span><br/>
            <span > as a substitute for the advice of a health professional. </span><br/>
            <span >We do not accept any liability for any injury, loss or damage caused by use of the information provided in our website.</span><br/>
            <span >The information may include the views or recommendations of third parties and does not necessarily reflect the views of </span><br/>
            <span >the Australian Government or indicate a commitment to a particular course of action.</span>
             
    </text>
            </div>
          </div>
          </div>
    );
}

export default TermsAndConditions;