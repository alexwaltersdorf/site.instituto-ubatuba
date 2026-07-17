/**
 * Remove os scripts de instalação do esbuild durante a resolução do pnpm.
 *
 * Motivo: o postinstall do esbuild (node install.js) valida o binário com
 * spawnSync, o que falha com EACCES no ambiente de build da Hostinger.
 * Sem scripts declarados, o pnpm não tem nada para executar (Hostinger)
 * nem para ignorar (evita ERR_PNPM_IGNORED_BUILDS no deploy da Manus).
 * O chmod +x dos binários é garantido por scripts/fix-esbuild.cjs, que
 * roda como primeiro passo de todo build (ver package.json).
 */
function readPackage(pkg) {
  if (pkg.name === "esbuild" || (pkg.name && pkg.name.startsWith("@esbuild/"))) {
    if (pkg.scripts) {
      delete pkg.scripts.preinstall;
      delete pkg.scripts.install;
      delete pkg.scripts.postinstall;
    }
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
