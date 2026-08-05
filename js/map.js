// EVIL CASINO - Branching Floor Map Generator (STS-lite)

const FloorMap = {
    weightedRandom(weights) {
        const entries = Object.entries(weights).filter(([, w]) => w > 0);
        const total = entries.reduce((sum, [, w]) => sum + w, 0);
        let roll = Math.random() * total;
        for (const [type, weight] of entries) {
            roll -= weight;
            if (roll <= 0) return type;
        }
        return entries[entries.length - 1][0];
    },

    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    /**
     * Indices in the next column that are geometrically adjacent to fromIndex.
     * Uses lane-interval overlap so a 2→3 widening always exposes both
     * adjacent options (top→top+middle, bottom→middle+bottom).
     */
    getAdjacentIndices(fromIndex, fromCount, toCount) {
        if (toCount <= 0) return [];
        if (toCount === 1) return [0];
        if (fromCount <= 1) {
            return Array.from({ length: toCount }, (_, i) => i);
        }

        const picks = new Set();
        const lo = Math.floor(fromIndex * toCount / fromCount);
        const hi = Math.ceil((fromIndex + 1) * toCount / fromCount) - 1;
        for (let j = lo; j <= hi; j++) {
            if (j >= 0 && j < toCount) picks.add(j);
        }

        // Always include the nearest center-mapped row
        const preferred = Math.round(fromIndex * (toCount - 1) / (fromCount - 1));
        picks.add(Math.max(0, Math.min(toCount - 1, preferred)));

        return [...picks].sort((a, b) => a - b);
    },

    /**
     * Generate a branching floor map.
     * @returns {{ columns: Array<Array<node>>, bossNode: node }}
     */
    generate(floor) {
        const columnsCount = CONFIG.ROOMS_PER_FLOOR[Math.min(floor - 1, CONFIG.ROOMS_PER_FLOOR.length - 1)] || 3;
        const weights = ROOM_WEIGHTS[floor] || ROOM_WEIGHTS[1];
        const [minW, maxW] = CONFIG.MAP_BRANCH_WIDTH || [2, 3];

        const columns = [];
        let idCounter = 0;

        // Start column — single entry
        columns.push([{
            id: `r${idCounter++}`,
            type: 'start',
            column: 0,
            row: 0,
            connections: [],
            visited: true,
            available: false,
            completed: true
        }]);

        for (let col = 1; col <= columnsCount; col++) {
            const width = Math.min(maxW, minW + Math.floor(Math.random() * (maxW - minW + 1)));
            const nodes = [];
            for (let row = 0; row < width; row++) {
                let type = this.weightedRandom(weights);
                // Soft guarantee: avoid all-shop / ensure some combat early
                if (col === 1 && type === 'shop') type = 'normal';
                if (col === 1 && type === 'rest') type = 'normal';
                nodes.push({
                    id: `r${idCounter++}`,
                    type,
                    column: col,
                    row,
                    connections: [],
                    visited: false,
                    available: false,
                    completed: false
                });
            }
            columns.push(nodes);
        }

        // Boss column
        const bossNode = {
            id: `boss-${floor}`,
            type: 'boss',
            column: columnsCount + 1,
            row: 0,
            connections: [],
            visited: false,
            available: false,
            completed: false,
            locked: true
        };
        columns.push([bossNode]);

        // Wire connections: each node links to geometrically adjacent next-column nodes
        for (let c = 0; c < columns.length - 1; c++) {
            const curr = columns[c];
            const next = columns[c + 1];
            curr.forEach((node, i) => {
                const targets = this.getAdjacentIndices(i, curr.length, next.length);
                node.connections = targets.map(idx => next[idx].id);
            });
            // Ensure every next node is reachable from something
            next.forEach(n => {
                const hasIncoming = curr.some(cn => cn.connections.includes(n.id));
                if (!hasIncoming) {
                    const from = curr[Math.floor(Math.random() * curr.length)];
                    if (!from.connections.includes(n.id)) from.connections.push(n.id);
                }
            });
        }

        // First column after start is available
        columns[1].forEach(n => { n.available = true; });

        return { columns, bossNode, currentNodeId: columns[0][0].id };
    },

    findNode(map, nodeId) {
        for (const col of map.columns) {
            const found = col.find(n => n.id === nodeId);
            if (found) return found;
        }
        return null;
    },

    getAvailableNodes(map) {
        const flat = map.columns.flat();
        return flat.filter(n => n.available && !n.completed && !(n.type === 'boss' && n.locked));
    },

    completeNode(map, nodeId, contractComplete = false) {
        const node = this.findNode(map, nodeId);
        if (!node) return;
        node.completed = true;
        node.visited = true;
        node.available = false;

        // Unlock connected next nodes
        const flat = map.columns.flat();
        flat.forEach(n => {
            if (n.available && n.column === node.column) n.available = false;
        });

        node.connections.forEach(connId => {
            const next = this.findNode(map, connId);
            if (!next || next.completed) return;
            if (next.type === 'boss') {
                // Boss is reachable when the path arrives — contract is judged after the fight
                next.locked = false;
                next.available = true;
            } else {
                next.available = true;
            }
        });

        map.currentNodeId = nodeId;
    },

    unlockBoss(map) {
        const boss = map.bossNode;
        if (!boss) return;
        boss.locked = false;
        const prevCol = map.columns[map.columns.length - 2] || [];
        const canReach = prevCol.some(n => n.completed && n.connections.includes(boss.id));
        boss.available = canReach;
    }
};
