import { Layout, Text } from "@ui-kitten/components";

const NoImages = () => {
  return (
    <Layout
      style={{
        alignItems: "center",
        flexGrow: 0,
        height: 200,
        marginBottom: 50,
      }}
    >
      <Layout
        style={{
          alignItems: "center",
          backgroundColor: "#E4E9F2",
          borderRadius: 16,
          flexGrow: 0,
          height: 200,
          justifyContent: "center",
          marginTop: 15,
          width: 250,
        }}
      >
        <Text category="h5">No hay imágenes</Text>
        <Text category="p2">Escribe para empezar</Text>
      </Layout>
    </Layout>
  );
};
export default NoImages;
