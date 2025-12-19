-- Administración
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'expedientes_view',   'Expedientes',   '<ul> <li>Tipo expediente: permite búsquedas según el tipo de expediente.</li> <li>Expediente: permite búsquedas por el número de expediente</li> <li>Etiqueta: puede buscarlo según la información colocada para identificar el expediente</li> <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li> </ul> Alta de expediente: <li>Se deberán completar los datos del expediente nuevo y hacer clic en ‘Aceptar’.</li>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'firmas_digitales_view',   'Firma digital',   '<ul> <li>Usuario/a solicitud: permite búsquedas según la persona que realizó la solicitud.</li> <li>Estado: permite búsquedas según el estado de la firma. </li> <li>Tipo de documento: permite búsquedas según el tipo de certificado.</li> <li>Fecha solicitud desde: permite búsquedas según un rango de fechas específicas.</li> <li>Fecha solicitud hasta: permite búsquedas según un rango de fechas específicas.</li> <li>Fecha firma desde: permite búsquedas según un rango de fechas específicas.</li> <li>Fecha firma hasta: permite búsquedas según un rango de fechas específicas.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'personas_fisicas_view',   'Persona física',   '<ul> <li>Número de documento: permite búsquedas por DNI, CUIT y pasaporte, entre otros.</li> <li>Nombre y apellido: permite búsquedas por el nombre o el apellido.</li> <li>Etiqueta: permite búsquedas según la información colocada para identificar el registro.</li> <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'persona_fisica_form',   'Personas física nueva',   '<ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <li>Para vincular a la persona al inmueble tiene que hacer clic en él + en la esquina superior derecha.</li> <li>En Domicilios debe figurar la dirección del titular de la cuenta.</li> <li>Geolocalización: La nomenclatura de las calles deberá estar escrita correctamente para que el proceso de geolocalización sea exacto.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'personas_juridicas_view',   'Personas jurídicas',   '<ul> <li>Número de documento: permite búsquedas por DNI, CUIT y pasaporte, entre otros.</li> <li>Denominación/ nombre de fantasía: permite búsquedas según el nombre legal registrado.</li> <li>Etiqueta: permite búsquedas según la información colocada para identificar el registro.</li> <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'persona_juridica_form',   'Personas jurídicas nueva',   '<ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <li>Para vincular a la persona al inmueble tiene que hacer clic en él + en la esquina superior derecha.</li> <li>En Domicilios debe figurar la dirección del titular de la cuenta.</li> <li>Geolocalización: La nomenclatura de las calles deberá estar escrita correctamente para que el proceso de geolocalización sea exacto.</li> </ul>',   '' );

-- Ingresos públicos
-- Tributos
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'inmuebles_view',   'Alta inmueble',   '<ul> <li> Cuenta: permite búsquedas del inmueble por su Número de Cuenta, Persona o Etiqueta.</li> <li>Ubicación: permite búsquedas del inmueble por la Nomenclatura Catastral o Dirección. <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'inmueble_form',   'Administración de Inmuebles nuevo',   '<ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <li>Para vincular a la persona al inmueble tiene que hacer clic en él + en la esquina superior derecha.</li> <li>En Domicilios debe figurar la dirección del titular de la cuenta.</li> <li>Al momento de asignar los datos de los Lados del terreno deberá cargar todos los campos para obtener una geolocalización correcta del domicilio del inmueble. </li> <li>Luego de haber creado el registro se visualizará la información de la cuenta.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'comercios_view',   'Alta comercios',   '<ul> <li>Cuenta: permite búsquedas del comercio por su Número de Cuenta, Persona o Etiqueta.</li> <li>Datos del comercio: permite búsquedas por la Cuenta del inmueble, el rubro o Nombre de fantasía</li> <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'comercio_form',   'Administración de Comercios nuevo',   '<ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <li>Para vincular a la persona al comercio tiene que hacer clic en él + en la esquina superior derecha.</li> <li>En Domicilios debe figurar la dirección del titular de la cuenta.</li> <li>Luego de haber creado el registro se visualizará la información de la cuenta.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'vehiculos_view',   'Alta vehiculos',   '<ul> <li>Cuenta: permite búsquedas del vehículo por su Número de Cuenta, por persona o Etiqueta</li> <li>Datos del vehículo: permite búsquedas del vehículo por su Dominio o la Marca-Modelo</li> <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'vehiculo_form',   'Administración de vehículos nuevo',   '<ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <li>Para vincular a la persona al vehículo tiene que hacer clic en él + en la esquina superior derecha.</li> <li>En Domicilios debe figurar la dirección del titular de la cuenta.</li> <li>Se debe completar los datos del comercio para poder guardar el registro </li> <li>Luego de haber creado el registro se visualizará la información de la cuenta.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'cementerios_view',   'Alta cementerio',   '<ul> <li> Cuenta: permite búsquedas del registro por el Número de Cuenta, Persona o Etiqueta.</li> <li>Datos de inhumado: permite búsquedas del registro por Número de Documento o Nombre-Apellido. </li> <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li> <li>Luego de haber creado el registro se visualizará la información de la cuenta.</li> <li>Para vincular a la persona al registro tiene que hacer clic en él + en la esquina superior derecha.</li> <li>Debe completar el Tipo Sepultura para guardar el registro.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'cementerio_form',   'Administración de cementerios nuevo',   '<ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <li>Para vincular a la persona al inmueble tiene que hacer clic en él + en la esquina superior derecha.</li> <li>En Domicilios debe figurar la dirección del titular de la cuenta.</li> <li>Luego de haber creado el registro se visualizará la información de la cuenta.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'fondeaderos_view',   'Alta fondeaderos',   '<ul> <li> Cuenta: permite búsquedas del fondeadero por Número de Cuenta, Persona o Etiqueta.</li> <li>Datos del fondeadero: permite búsquedas por Tipo de Fondeadero o Embarcación.</li> <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'fondeadero_form',   'Administración de fondeaderos nuevo',   '<ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <li>Para vincular a la persona al Fondeadero tiene que hacer clic en él + en la esquina superior derecha.</li> <li>En Domicilios debe figurar la dirección del titular de la cuenta.</li> <li>Luego de haber creado el registro se visualizará la información de la cuenta.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'cuentas_especiales_view',   'Alta cuentas especiales',   '<ul> <li> Permite búsquedas por el registro de número de cuenta, Persona o Etiqueta.</li> <li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li> <li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'cuenta_especial_form',   'Administración de cuentas especiales nueva',   '<ul> <li>Deberá completar los campos obligatorios para poder dar de alta el registro.</li> <li>Para vincular a la persona al inmueble tiene que hacer clic en él + en la esquina superior derecha.</li> <li>En Domicilios debe figurar la dirección del titular de la cuenta.</li> <li>Luego de haber creado el registro se visualizará la información de la cuenta.</li> </ul>',   '' );
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (   'contribuyentes_view',   'Contribuyentes',   '<ul> <li>Debe hacer clic en ‘Seleccione un contribuyente’ para visualizar los tipos de tributos asociados al contribuyente.  </li> </ul>',   '' );

-- Facturación

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'derechos_especiales_view',
  'Derechos especiales',
  '<ul>
<li> Código: permite búsquedas según el código asignado en el registro.</li>
<li>Descripción: permite búsquedas según palabras claves colocadas en la descripción. </li>
<li>Tipo de tributos: permite búsquedas según el tributo colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'derecho_especial_form',
  'Definición de derechos especiales nueva',
  '<ul>
<li>Deberá completar los campos obligatorios y se hará clic en el botón de ‘Siguiente’.</li>
<li>Se completarán los campos necesarios y se hará clic en ‘Guardar.</li>
<li>Luego de haber creado el registro se visualizará la información.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'recibos_especiales_view',
  'Recibos especiales',
  '<ul>
<li> Código: permite búsquedas según el código asignado en el registro.</li>
<li> Descripción: permite búsquedas según palabras claves colocadas en la descripción.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'recibo_especial_form',
  'Definición de recibos especiales nueva',
  '<ul>
<li>Deberá completar los campos obligatorios y se hará clic en el botón de ‘Siguiente’.</li>
<li>Se completarán los campos necesarios y se hará clic en ‘Guardar.</li>
<li>Luego de haber creado el registro se visualizará la información.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'pago_recibo_especial_view',
  'Emisión de VEP especial',
  '<ul>
<li>Contribuyente: permite búsquedas por número de documento nombre o etiqueta.</li>
<li>VEP especial: permite búsquedas según el tipo de recibo.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
</ul>',
  ''
);

-- Emisión
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'procedimientos_view',
  'Procedimientos de emisión',
  '<ul>
<li> Tipo de tributo: permite búsquedas según el tipo de tributo.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'procedimiento_form',
  'Procedimientos de emisión nuevo',
  '<ul>
<li>Deberá completar los campos obligatorios y se hará clic en el botón de ‘Siguiente’.</li>
<li>Se completarán los campos necesarios y se hará clic en ‘Guardar.</li>
<li>Luego de haber creado el registro se visualizará la información.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'emision_definiciones_view',
  'Definición de emisiones',
  '<ul>
<li> Tipo de tributo: permite búsquedas según el tipo de tributo.
<li> Número definición: permite búsquedas según la numeración que se le asignó en el registro.</li>
<li> Descripción: permite búsquedas según palabras claves colocadas en la descripción. </li>
<li> Etiqueta: permite búsquedas según la información colocada para identificar el registro.</li>
<li> Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li> Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'emision_definicion_form',
  'Definición de emisiones nueva',
  '<ul>
<li>Deberá completar los campos obligatorios y se hará clic en el botón de ‘Siguiente’.</li>
<li>Se completarán los campos necesarios y se hará clic en ‘Guardar.</li>
<li>Luego de haber creado el registro se visualizará la información.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'emision_ejecuciones_view',
  'Ejecuciones de emisiones',
  '<ul>
<li>Tipo de tributo: permite búsquedas según el tipo de tributo. </li>
<li>Número definición: permite búsquedas según la numeración que se le asignó en el registro. </li>
<li>Número ejecución: permite búsquedas según la numeración que se le asignó en el registro. </li>
<li>Periodo: permite búsquedas según el año del registro. </li>
<li>Etiqueta: permite búsquedas según la información colocada para identificar el registro. </li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos. </li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha. </li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'emision_ejecucion_form',
  'Ejecución de Emisiones nueva',
  '<ul>
<li>Deberá completar los campos obligatorios y se hará clic en el botón de ‘Siguiente’.</li>
<li>Se completarán los campos necesarios y se hará clic en ‘Guardar.</li>
<li>Luego de haber creado el registro se visualizará la información.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'cuentas_prueba_view',
  'Cuentas de prueba',
  '<ul>
<li> Tipo de Tributo: permite búsquedas según el tipo de tributo. </li>
</ul>',
  ''
);

-- Financiación

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'convenio_definiciones_view',
  'Definición de convenios',
  '<ul>
<li> Código: permite búsquedas según el código asignado en el registro.</li>
<li> Nombre: permite búsquedas según el nombre asignado.</li>
<li> Convenio: se permite búsquedas según el nombre del convenio.</li>
<li> Tipo de tributo: permite búsquedas según el tipo de tributo.</li>
<li> Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li> Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
Definición de Convenio: Nuevo
<li> Se completarán los campos necesarios y se hará clic en ‘Guardar’.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'plan_pago_view',
  'Plan de pago',
  '<ul>
<li> Tipo plan pago: permite búsquedas según el tipo de plan seleccionado.</li>
<li> Tipo de tributo: permite búsquedas según el tipo de tributo seleccionado.</li>
<li> Estado: permite seleccionar el estado en que se encuentra el registro.</li>
<li> Etiqueta: permite búsquedas según la información colocada para identificar el registro.</li>
<li> Tasa: permite búsquedas según las tasas colocadas en el registro.</li>
<li> Subtasa: permite búsquedas según las subtasas colocadas en el registro.</li>
<li> Fecha desde: permite búsquedas según la fecha colocada en el registro.</li>
<li> Fecha hasta: permite búsquedas según la fecha colocada en el registro.</li>
<li> Descripción: permite búsquedas según palabras claves colocadas en la descripción. </li>
<li> Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li> Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'plan_pago_definicion_form',
  'Definición de Planes de Pago nueva',
  '<ul>
<li>Deberá completar los campos obligatorios y se hará clic en el botón de ‘Siguiente’.</li>
<li>Se completarán los campos necesarios y se hará clic en ‘Guardar.</li>
<li>Luego de haber creado el registro se visualizará la información.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'pagos_contados_definicion_view',
  'Pagos contado',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.<li>
<li>Nombre: permite búsquedas según el nombre asignado.<li>
<li>Convenio: se permite búsquedas según el nombre del convenio.<li>
<li>Tipo de Tributo:  permite búsquedas según el tipo de tributo.<li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.<li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha </li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'pago_contado_definicion_form',
  'Definición de pagos contado',
  '<ul>
<li>Deberá completar los campos obligatorios y se hará clic en el botón de ‘Siguiente’.</li>
<li>Se completarán los campos necesarios y se hará clic en ‘Guardar.</li>
<li>Luego de haber creado el registro se visualizará la información.</li>
</ul>',
  ''
);

-- Escribanos

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'escribanos_view',
  'Escribanos',
  '<ul>
<li>Código: permite búsquedas según el código colocado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre asignado en el registro.</li>
<li>Matrícula: permite búsquedas según la matrícula colocada en el registro.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'certificados_escribano_view',
  'Certificados',
  '<ul>
<li>Año certificado: permite búsquedas según el año colocado en el registro.</li>
<li>Número certificado: permite búsquedas según el número asignado en el registro.</li>
<li>Tipo certificado: permite búsquedas según el certificado colocado en el registro.</li>
<li>Escribano: permite búsquedas según el escribano seleccionado en el registro.</li>
<li>Cuenta: permite búsquedas según el inmueble seleccionado en el registro.</li>
<li>Etiqueta: permite búsquedas según la información colocada para identificar el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Certificado: Nuevo
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’. </li>',
  ''
);

-- Legales

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'organos_judiciales_view',
  'Órganos judiciales',
  '<ul>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha. </li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'plantillas_documentos_view',
  'Plantillas documentos',
  '<ul>
Alta plantilla Documento
<li>Para agregar registro hacer clic en el + en la esquina superior derecha. </li>
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’. </li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipos_actos_procesales_view',
  'Tipos actos procesales',
  '<ul>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Tipo Acto Procesal: Nuevo
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipo_relacion_cert_apremio_view',
  'Tipo relaciones certificado apremio persona',
  '<ul>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Tipo relación certificado apremio persona: Nuevo
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'certificados_apremios_view',
  'Certificados',
  '<ul>
<li> Apremio: permite búsquedas según el apremio seleccionado en el registro.</li>
<li> Cuenta: permite búsquedas según la cuenta del tributo seleccionada en el registro.</li>
<li> Estado certificado: permite búsquedas según el estado del certificado.</li>
<li> Número certificado: permite búsquedas según el número asignado al registro.</li>
<li> Fecha certificado desde: permite búsquedas según la fecha colocada en el registro.</li>
<li> Fecha certificado hasta: permite búsquedas según la fecha colocada en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'certificado_apremio_form',
  'Ingresos Públicos nuevo certificado',
  '<ul>
<li>Se completarán los campos y se hará click en el botón de ‘Generar’.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'apremios_view',
  'Apremios',
  '<ul>
<li> Número: permite búsquedas según el número colocado en el registro.</li>
<li> Carátula: permite búsquedas con palabras colocadas en el registro.</li>
<li> Expediente: permite búsquedas según el expediente relacionado al registro.</li>
<li> Organismo judicial: permite búsquedas según el organismo judicial relacionado al registro.</li>
<li> Fecha desde: permite búsquedas según la fecha colocada en el registro.</li>
<li> Fecha hasta: permite búsquedas según la fecha colocada en el registro.</li>
<li> Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
</ul>',
  ''
);

-- Entidades

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'categorias_tasas_view',
  'Categoría de tasas',
  '<ul>
<li> Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tasas_view',
  'Tasas',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Descripción: permite búsquedas según palabras claves colocadas en la descripción. </li>
<li>Etiqueta: permite búsquedas según la observaciones que se colocaron en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tasa_form',
  'Tasa nuevo',
  '<ul>
<li>Deberá completar los campos obligatorios para poder dar de alta el registro y hacer click en ''Guardar''.</li>
<li>Luego de haber creado el registro se visualizará la información de la cuenta.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'subtasas_view',
  'Sub tasas',
  '<ul>
<li> Tasa: permite búsquedas según las tasas colocadas en el registro.</li>
<li> Código: permite búsquedas según el código asignado en el registro.</li>
<li> Descripción: permite búsquedas según palabras claves colocadas en la descripción. </li>
<li> Etiqueta: permite búsquedas según la información colocada para identificar el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'subtasa_form',
  'Sub tasas nuevo',
  '<ul>
<li>Deberá completar los campos obligatorios para poder dar de alta el registro y hacer click en ''Guardar''.</li>
<li>Luego de haber creado el registro se visualizará la información de la cuenta.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipo_movimientos_view',
  'Tipos de movimientos',
  '<ul>
<li> Código: permite búsquedas según el código asignado en el registro.</li>
<li> Nombre: permite búsquedas según el nombre asignado en el registro.</li>
<li> Número: permite búsquedas según el número colocado en el registro.</li>
<li> Imputación: permite búsquedas según la imputación asignada en el registro.</li>
<li> Tipo: permite búsquedas según el tipo colocado en el registro.</li>
<li> Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li> Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'controladores_view',
  'Controladores',
  '<ul>
<li>Tipo de controlador: permite búsquedas según el tipo de  controlador seleccionado en el registro.</li>
<li>Supervisor/a: permite búsquedas según el supervisor/a seleccionado en el registro.</li>
<li>Persona: permite búsquedas según la persona fisica relacionada con el registro.</li>
<li>Etiqueta: permite búsquedas según la información colocada para identificar el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Controlador: Nuevo
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’.</li>',
  ''
);
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipo_controladores_view',
  'Tipo de controladores',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Tipo de tributo: permite búsquedas según el tributo colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Tipo de controlador
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’.</li>',
  ''
);
INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipo_condiciones_especiales_view',
  'Tipo de condiciones especiales',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Tipo de tributo: permite búsquedas según el tributo colocado en el registro.</li>
<li>Tipo: permite búsquedas según el número colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipo_recargos_descuentos_view',
  'Recargos y descuentos',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Tipo de tributo: permite búsquedas según el tributo colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Tipo recargo descuento: Nuevo
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipos_multas_view',
  'Tipos de multas',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Tipo de Tributo: permite búsquedas según el tributo colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Alta Tipos de Multas
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipos_arrendamientos_view',
  'Tipos de arrendamientos',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Alta Arrendamientos
<li>Se completarán los campos y se hará click en el botón de ‘Guardar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'inciso_vehiculos_view',
  'Inciso de vehículos',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Código Sucerp: permite búsquedas según el código asignado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Inciso vehículo:
<li>Se completarán los campos y se hará click en el botón de ‘Guardar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'categorias_vehiculos_view',
  'Categorias de vehiculos',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Código Sucerp: permite búsquedas según el código asignado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Categoría de vehículo
<li>Se completarán los campos y se hará click en el botón de ‘Guardar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'rubros_view',
  'Rubros',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Alta Rubros
<li>Se completarán los campos y se hará click en el botón de ‘Guardar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'categorias_ubicaciones_view',
  '',
  '<ul>
<li>Código: permite búsquedas según el código asignado en el registro.</li>
<li>Nombre: permite búsquedas según el nombre colocado en el registro.</li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Categoría de Ubicación
<li>Se completarán los campos y se hará click en el botón de ‘Guardar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tablas_definicion_view',
  'Definición de tablas',
  '<ul>
<li>Botones de ABM (Alta, Baja y Modificación)</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tabla_definicion_form',
  'Definición de tablas nueva',
  '<ul>
<li>Deberá completar los campos obligatorios y se hará clic en el botón de ‘Siguiente’.</li>
<li>Se completarán los campos necesarios y se hará clic en ‘Guardar.</li>
<li>Luego de haber creado el registro se visualizará la información.</li>
</ul>',
  ''
);

-- Configuración

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'variables_view',
  'Variables',
  '<ul>
<li>Tipo de tributo: permite búsquedas según el tributo colocado en el registro.</li>
<li>Código / Descripción: permite búsquedas según el código asignado en el registro.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Variable: Nuevo
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’..</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'variables_globales_view',
  'Variables globales',
  '<ul>
<li>Código / Descripción: permite búsquedas según el código asignado en el registro.</li>
<li>Para agregar registro hacer clic en el + en la esquina superior derecha.</li>
</ul>
Seleccione el tipo de variable a completar
<li>Se seleccionará el tipo de variable, se hará clic sobre él.</li>
<li>Se completarán los campos y se hará click en el botón de ‘Aceptar’.</li>',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'clases_elementos_view',
  'Administración de clases',
  '<ul>
<li>Tipo de tributo: permite búsquedas según el tributo colocado en el registro.</li>
</ul>
Clase Elemento: Nuevo
Se completarán los campos y se hará click en el botón de ‘Aceptar’.',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'tipos_elementos_view',
  'Administración de tipos',
  '<ul>
<li>Tipo de tributo: permite búsquedas según el tributo colocado en el registro.</li>
<li>Clase elemento: permite búsquedas según el tipo de elemento asociado al tributo seleccionado. </li>
<li>Para realizar la búsqueda se debe ingresar al menos uno de los campos. </li>
</ul>
Tipo Elemento: Nuevo
Se completarán los campos y se hará click en el botón de ‘Aceptar’.',
  ''
);

INSERT INTO public.tip (codigo, titulo, descripcion, link) VALUES (
  'modelos_declaraciones_juradas_view',
  'Modelos de declaraciones juradas',
  '<ul>
<li>Nombre: permite búsquedas según el nombre asignado.</li>
</ul>',
  ''
);
