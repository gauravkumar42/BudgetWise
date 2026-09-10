const Loader = ({ fullPage = false, label = "Loading..." }) => {
  if (fullPage) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark"></div>
        <p>{label}</p>
      </div>
    );
  }
  return <div className="spinner spinner-dark" style={{ margin: "20px auto" }}></div>;
};

export default Loader;
