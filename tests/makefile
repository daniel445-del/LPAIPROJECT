# Makefile para remover autenticação obrigatória e fazer deploy

# Remove ou limpa middleware.ts
clean-middleware:
	rm -f middleware.ts
	echo "// middleware desativado" > middleware.ts
	@echo "✅ middleware.ts removido/desativado"

# Remove callbacks de autenticação forçada do auth.config.ts
clean-auth-config:
	sed -i '/callbacks:/,/^[ \t]*}/d' app/\(auth\)/auth.config.ts || true
	@echo "✅ callbacks de auth removidos de auth.config.ts"

# Faz build, commit e push
deploy:
	npm install
	npm run build
	git add .
	git commit -m "🔓 remove login requirement"
	git push
	@echo "🚀 Deploy enviado para o GitHub"

# Atalho para fazer tudo de uma vez
all: clean-middleware clean-auth-config deploy
