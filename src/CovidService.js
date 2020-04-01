const url = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?outFields=*&where=1%3D1&f=geojson';
export async function get() {
  const res = await fetch(url);
  return await res.json();
}

export default { get }