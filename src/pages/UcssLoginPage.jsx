import { useState } from 'react';
import { useSession } from '../context/SessionContext.jsx';

export default function UcssLoginPage() {
  const { login, students } = useSession();
  const [username, setUsername] = useState('20211234');
  const [password, setPassword] = useState('••••••••');
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    login(username, password);
  }

  function handleQuickLogin(userCode) {
    setUsername(userCode);
    login(userCode, 'demo');
  }

  return (
    <div className="ucss-raw-login-page">
      <div className="container pt-3">
        <div id="divPrincipal">
          <div className="row css-login-main-row">
            <div className="col-logo-v d-none d-sm-block">
              <img
                src="/logo-ucss-v.jpg"
                id="imgLogoUCSS"
                className="css-img-logo-ucss-login"
                alt="Universidad Católica Sedes Sapientiae"
              />
            </div>

            <div className="col-form-login">
              <div className="row css-login">
                <div className="css-mobile-logo-wrap text-center pb-2">
                  <img
                    src="/logo-ucss.png"
                    className="css-img-logo-mobile"
                    alt="Logo UCSS"
                  />
                </div>
                <div className="col-12 css-login-form">
                  <div className="row text-center pt-3 pb-2">
                    <div className="col-12">
                      <h2 className="fw-bold ucss-login-heading">INTRANET</h2>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-12">
                        <label htmlFor="txtUsuarioMail" className="form-label fw-bold">
                          Usuario
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bkg-color-secondary" aria-hidden="true">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#495057"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                          </span>
                          <input
                            name="txtUsuarioMail"
                            type="text"
                            id="txtUsuarioMail"
                            className="form-control LoginType"
                            placeholder="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-12">
                        <label htmlFor="txtPwd" className="form-label fw-bold">
                          Contraseña
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bkg-color-secondary" aria-hidden="true">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#495057"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1.337 0A3.5 3.5 0 0 1 3.5 11.5M3 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                            </svg>
                          </span>
                          <input
                            name="txtPwd"
                            type="password"
                            maxLength="30"
                            id="txtPwd"
                            className="form-control LoginType"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row pt-2">
                      <div className="col-12">
                        <input
                          type="submit"
                          name="btnIngresar"
                          value="Ingresar"
                          id="btnIngresar"
                          className="btn btn-sm btn-primary w-100 fw-bold btn-ucss-submit"
                        />
                      </div>
                    </div>
                    <div className="row text-center pt-2">
                      <div className="col-12">
                        <a
                          href="#recuperar"
                          onClick={(e) => e.preventDefault()}
                          className="fw-bold text-decoration-none ucss-link-recuperar"
                        >
                          Olvidé mi contraseña
                        </a>
                      </div>
                    </div>
                  </form>

                  {/* Acceso rápido a usuarios demo ficticios del prototipo */}
                  <div className="ucss-login-demo-bar">
                    <button
                      type="button"
                      className="demo-selector-toggle"
                      onClick={() => setShowDemoSelector((v) => !v)}
                    >
                      {showDemoSelector ? '▲ Ocultar usuarios de prueba' : '▼ Acceso rápido usuarios de prueba (Demo)'}
                    </button>

                    {showDemoSelector && (
                      <div className="demo-selector-box">
                        <span className="demo-selector-label">Estudiantes de ejemplo:</span>
                        <div className="demo-selector-buttons">
                          {students.map((st) => (
                            <button
                              key={st.code}
                              type="button"
                              className="demo-btn-student"
                              onClick={() => handleQuickLogin(st.code)}
                            >
                              {st.name} ({st.code})
                            </button>
                          ))}
                        </div>
                        <div className="demo-selector-org-box">
                          <button
                            type="button"
                            className="demo-btn-organizer"
                            onClick={() => handleQuickLogin('organizador')}
                          >
                            Ingresar como Organizador (Demo)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 p-0">
              <hr className="m-1" />
            </div>
          </div>

          {/* Enlaces de pie oficiales UCSS */}
          <div className="row css-pie-enlaces bkg-color-ucss">
            <div className="col-pie col-12 col-sm-6 col-md-4">
              <p className="fw-bold">SERVICIOS AL ESTUDIANTE</p>
              <ul>
                <li><a href="https://www.ucss.edu.pe/grados-y-titulos" target="_blank" rel="noreferrer">Grados y Títulos</a></li>
                <li><a href="http://repositorio.ucss.edu.pe/" target="_blank" rel="noreferrer">Repositorio Institucional</a></li>
                <li><a href="https://www.ucss.edu.pe/asuntos-academicos" target="_blank" rel="noreferrer">Asuntos Académicos</a></li>
                <li><a href="https://www.ucss.edu.pe/cuentas-corrientes" target="_blank" rel="noreferrer">Asuntos Económicos</a></li>
                <li><a href="https://www.ucss.edu.pe/bienestar-universitario" target="_blank" rel="noreferrer">Bienestar Universitario</a></li>
                <li><a href="https://ucss.aptitus.com/" target="_blank" rel="noreferrer">Bolsa de Trabajo - OILSE</a></li>
                <li><a href="https://www.ucss.edu.pe/servicio-medico" target="_blank" rel="noreferrer">Servicio Médico</a></li>
                <li><a href="https://www.ucss.edu.pe/servicio-odontologico" target="_blank" rel="noreferrer">Servicio Odontológico</a></li>
                <li><a href="https://www.ucss.edu.pe/servicio-psicologico" target="_blank" rel="noreferrer">Servicio Psicológico</a></li>
                <li><a href="https://www.ucss.edu.pe/pastoral-universitaria" target="_blank" rel="noreferrer">Pastoral Universitaria</a></li>
              </ul>
            </div>

            <div className="col-pie col-12 col-sm-6 col-md-4">
              <p className="fw-bold">DIRECCION DE EXTENSIÓN</p>
              <ul>
                <li><a href="https://cib.ucss.edu.pe/" target="_blank" rel="noreferrer">CIB</a></li>
                <li><a href="https://cidir.ucss.edu.pe/" target="_blank" rel="noreferrer">CIDIR</a></li>
                <li><a href="https://www.ucss.edu.pe/serh/" target="_blank" rel="noreferrer">SERH</a></li>
                <li><a href="http://itucss.ucss.edu.pe/" target="_blank" rel="noreferrer">ITUCSS</a></li>
                <li><a href="https://idiomas.ucss.edu.pe/" target="_blank" rel="noreferrer">Centro de Idiomas</a></li>
                <li><span className="disabled">Oficina de Proyectos</span></li>
              </ul>
            </div>

            <div className="col-pie col-12 col-sm-6 col-md-4">
              <p className="fw-bold">PROYECCIÓN SOCIAL Y SERVICIOS</p>

              <p className="fw-bold fw-sub">Proyección Social</p>
              <ul>
                <li><a href="http://alecrim.ucss.edu.pe/" target="_blank" rel="noreferrer">Centro de Atención Infantil ALECRIM</a></li>
                <li><a href="https://www.ucss.edu.pe/iniciativas-y-programas/institucion-educativa-luigi-giussiani" target="_blank" rel="noreferrer">Luigi Giussiani - Centro Educativo Inicial</a></li>
              </ul>

              <p className="fw-bold fw-sub">Servicios</p>
              <ul>
                <li><a href="https://cease.ucss.edu.pe/" target="_blank" rel="noreferrer">CEASE</a></li>
                <li><a href="https://odt.ucss.edu.pe/" target="_blank" rel="noreferrer">ODT</a></li>
                <li><span className="disabled">LLAMKAY</span></li>
                <li><span className="disabled">PIKANWE</span></li>
              </ul>
            </div>
          </div>

          <div className="row pt-2 pb-3 css-pie-dir-row">
            <div className="col-12 px-0">
              <div className="css-pie-dir pt-1 pb-1">
                <div className="pie-logo-cell">
                  <img alt="logo pie" src="/logo_pie.png" width="141" height="49" />
                </div>
                <div className="pie-text-cell">
                  <span>© 2022 UCSS. TODOS LOS DERECHOS RESERVADOS. Esq. Constelaciones y Sol de Oro s/n Urb. Sol de Oro. Los Olivos. Lima - Perú.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
