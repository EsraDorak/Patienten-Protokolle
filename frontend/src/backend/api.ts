// istanbul ignore file -- no coverage, since we would need a running backend for that

import { EintragResource, ProtokollResource } from "../Resources";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";
import { eintraege, protokolle } from "./testdata";

export async function getAlleProtokolle(): Promise<ProtokollResource[]> {
    if (process.env.REACT_APP_REAL_FETCH!=='true') {
        await new Promise(r => setTimeout(r, 700));
        return Promise.resolve(protokolle);
    } else {
        try {
       const response = await fetchWithErrorHandling(`${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/alle`);
       
        if(!response.ok) {
            throw new Error(`Fehler beim Laden der Einträge: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
        }
    }
}
export async function getAllePrivateProtokolle(): Promise<ProtokollResource[]> {
  if (process.env.REACT_APP_REAL_FETCH!=='true') {
      await new Promise(r => setTimeout(r, 700));
      return Promise.resolve(protokolle);
  } else {
      try {
     const response = await fetchWithErrorHandling(`${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/alle`, {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include" as RequestCredentials,
    });
      if(!response.ok) {
          throw new Error(`Fehler beim Laden der Einträge: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
      }
  }
}
export async function getAlleEintraege(protokollId: string): Promise<EintragResource[]> {
  if (process.env.REACT_APP_REAL_FETCH !== 'true') {
      await new Promise(r => setTimeout(r, 700));
      return Promise.resolve(eintraege);
  } else {

      const response = await fetchWithErrorHandling(`${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}/eintraege`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: "include" as RequestCredentials,
      });

      if (!response.ok) {
          throw new Error(`Status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
  }
}

export async function getProtokoll(protokollId: string): Promise<ProtokollResource> {
  if (process.env.REACT_APP_REAL_FETCH !== 'true') {
      await new Promise(r => setTimeout(r, 700));
      return Promise.resolve(protokolle[0]);
  } else {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: "include" as RequestCredentials,
      });

      if (!response.ok) {
          throw new Error(`Status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
  }
}

  export async function createProtokoll(protokoll: ProtokollResource): Promise<ProtokollResource> {
    if (process.env.REACT_APP_REAL_FETCH !== 'true') {
        await new Promise(r => setTimeout(r, 700));
        return Promise.resolve(protokoll);
    } else {
        const response = await fetchWithErrorHandling(`${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokoll.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include" as RequestCredentials,
            body: JSON.stringify(protokoll),
        });
  
        if (!response.ok) {
            throw new Error(`Status ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
    }
  }
  

export async function updateProtokoll(protokoll: ProtokollResource): Promise<ProtokollResource> {
  if (process.env.REACT_APP_REAL_FETCH !== 'true') {
      await new Promise(r => setTimeout(r, 700));
      return Promise.resolve(protokoll);
  } else {
      const response = await fetchWithErrorHandling(`${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokoll.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: "include" as RequestCredentials,
          body: JSON.stringify(protokoll),
      });

      if (!response.ok) {
          throw new Error(`Status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
  }
}


export async function deleteProtokoll(protokollId: string): Promise<void> {
  if (process.env.REACT_APP_REAL_FETCH !== 'true') {
    await new Promise(r => setTimeout(r, 700));
    return Promise.resolve();
  } else {
    const response = await fetchWithErrorHandling(`${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include" as RequestCredentials,
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}: ${response.statusText}`);
    }
  }
}


  export async function getEintrag(eintragId: string): Promise<EintragResource> {
    if (process.env.REACT_APP_REAL_FETCH !== 'true') {
      await new Promise((r) => setTimeout(r, 700));
  
      const eintrag = eintraege.find((e) => e.id === eintragId);
      if (eintrag) {
        return Promise.resolve(eintrag);
      } else {
        return Promise.reject(new Error(`Eintrag with ID ${eintragId} not found`));
      }
    } else {
      try {
        const response = await fetchWithErrorHandling(
          `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragId}`
        );
  
        if (!response.ok) {
          throw new Error(`Fehler beim Laden des Eintrags: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Eintrag:', error);
        throw error;
      }
    }
  }

  export async function createEintrag(protokollId: string, eintrag: EintragResource): Promise<EintragResource> {
    if (process.env.REACT_APP_REAL_FETCH !== 'true') {
      await new Promise(r => setTimeout(r, 700));
      return Promise.resolve(eintrag);
    } else {
      try {
        const response = await fetchWithErrorHandling(
          `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}/eintraege`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include" as RequestCredentials,
            body: JSON.stringify(eintrag),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Status ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error creating Eintrag:', error);
        throw error;
      }
    }
  }
  
  export async function updateEintrag(eintragId: string, eintrag: EintragResource): Promise<EintragResource> {
    if (process.env.REACT_APP_REAL_FETCH !== 'true') {
      await new Promise(r => setTimeout(r, 700));
      return Promise.resolve(eintrag);
    } else {
      try {
        const response = await fetchWithErrorHandling(
          `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include" as RequestCredentials,
            body: JSON.stringify(eintrag),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Status ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating Eintrag:', error);
        throw error;
      }
    }
  }
  
  export async function deleteEintrag(eintragId: string): Promise<void> {
    if (process.env.REACT_APP_REAL_FETCH !== 'true') {
      await new Promise(r => setTimeout(r, 700));
      return Promise.resolve();
    } else {
      try {
        const response = await fetchWithErrorHandling(
          `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include" as RequestCredentials,
          }
        );
  
        if (!response.ok) {
          throw new Error(`Status ${response.status}: ${response.statusText}`);
        }
  
        // Return void, as the entry is successfully deleted
        return Promise.resolve();
      } catch (error) {
        console.error('Error deleting Eintrag:', error);
        throw error;
      }
    }
  }
  